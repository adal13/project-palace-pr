<template>
    <div class="body">
        <div class="img_palace">
            <h2 class="logo-text">Bienvenido</h2>

            <img src="../../public/img//palace_resorts_logo-removebg-preview2.png" alt="Imagen The palace company"
                class="img-center">
        </div>
        <div class="line"></div>

        <div class="cristal-container">
            <div class="circle">
                <v-icon icon="mdi-account-circle" color="#fff" size="120" class="user-icon" />
            </div>
            <form @submit.prevent="handleLogin" class="cristal">

                <v-icon icon="mdi-account" color="#fff" size="30" class="icon" />
                <div class="input-container">
                    <div class="input-wrapper">
                        <input-global title="" name="Nombre de usuario" v-model="loginDetails.user"
                            @update:value="newValue => updateI('user', newValue)" />
                    </div>
                </div>

                <v-icon icon="mdi-lock" color="#fff" size="30" />
                <div class="input-container">
                    <div class="input-wrapper">
                        <input-global title="" name="Contraseña" v-model="loginDetails.password"
                            @update:value="updatePassword" :type="passwordFieldType" classInput="demo__text" />

                        <v-icon :icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'" color="#fff" size="30"
                            @click="togglePasswordVisibility" class="password-icon" />
                    </div>
                </div>
                <div class="alingbutton">
                    <global-btn type="submit" btn_global="INICIAR SESIÓN" />
                </div>
                <span v-show="mostrarMensajeCredUserIAMs" :type="tipoDeAlerta" style="color: red;">
                    {{ mensajeCredUserIAMs }}
                </span>
            </form>
        </div>

    </div>

</template>

<script setup lang="ts">
import { inputGlobal } from '../importFile';
import { globalBtn } from '../importFile';
import * as bcrypt from 'bcryptjs'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { inicioSesion, UserData } from '../types';
import * as API from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
// import * as amplifyconfig from '../amplifyconfiguration.json'
import { amplifyConfig } from '../importFile'
import { usedataStore } from '../store/datoUsuario';
import mostrarMensajeTempralCredUserIAMs, { mostrarMensajeCredUserIAMs, mensajeCredUserIAMs, tipoDeAlerta } from './helper/mensaje'



Amplify.configure(amplifyConfig)
const dataStore = usedataStore()

const loginDetails = ref<inicioSesion>({
    user: '',
    password: '',
})

const router = useRouter()

const handleLogin = async () => {
    const hashedPassword = bcrypt.hashSync('password', 10)
    const passwordMatch = bcrypt.compareSync(loginDetails.value.password, hashedPassword)
    console.log('passwordMatch', passwordMatch)

    const authenticated = false
    console.log('Entrando', authenticated)

    let data: UserData | null = null;

    try {

        const respose = await API.post({
            apiName: 'access_API',
            path: '/dev/users/auth',
            options: {
                body: loginDetails.value
            }
        });
        const responsData = await respose.response
        if (responsData.statusCode === 200) {
            const jsonData = await responsData.body.json();
            if (typeof jsonData === 'object' && jsonData !== null) {
                data = jsonData as unknown as UserData;
                const role = data?.data?.userDTO?.role
                const idUser = data?.data?.userDTO?.id

                dataStore.setLoggedIn(role, idUser)

                const roleRoutes = {
                    'ADMIN': '/Home',
                    'INVITADO': '/clientView'
                };

                const route = roleRoutes[role as keyof typeof roleRoutes];
                if (route) {
                    await router.push(route);
                    return true;
                } else {
                    console.error('Rol desconocido:', role);
                    await router.push('/');
                    return false;
                }
            } else {
                console.error('Los datos no son un objeto JSON válido:', jsonData);
            }


        } else {
            return false
        }

    } catch (errorMessages) {
        errorMessages = 'Nombre del usuario y/o contraseña incorrecta';
        mostrarMensajeTempralCredUserIAMs('messageAuthError', 'error')

    }
};

const updateI = (fielName: string, value: string) => {
    loginDetails.value = { ...loginDetails.value, [fielName]: value }
}


const passwordFieldType = ref('password');

const updatePassword = (newValue: string) => {
    loginDetails.value.password = newValue;
};

const togglePasswordVisibility = () => {
    passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

const passwordVisible = false



</script>

<style scoped>
/* simulacion de carga */
#loader-container {
    width: 100%;
    height: 4px;
    background-color: #ddd;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: none;
}


/* Estilos para la barra de carga animada */
#loader {
    height: 100%;
    background-color: #007bff;
    /* Color de la barra de carga */
    animation: progressAnimation 2s linear forwards;
    /* Duración y tipo de animación */
}

/* Animación de la barra de carga */
@keyframes progressAnimation {
    0% {
        width: 0%;
        /* Ancho inicial de la barra de carga */
    }

    100% {
        width: 100%;
        /* Ancho al 100% al final de la animación */
    }
}





.body {
    background-color: #145474;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.img_palace {
    /* display: flex; */
    justify-content: center;
    align-items: center;
}



.img-center {
    width: 200px;
    height: 200px;
    position: relative;
    left: 15%;

}

h2 {
    font-family: Verdana, Tahoma, sans-serif;
    font-size: 45px;
    /* text-align: center; */
    background: linear-gradient(to right, rgba(20,
                84,
                116,
                1), #fff 50%, #6C6B6C);
    background-size: 200% auto;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient 3s linear infinite;
    top: 10px;
}

@keyframes gradient {
    0% {
        background-position: 0% 75%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 70%;
    }

}

.logo-text {
    position: relative;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    letter-spacing: 3px;
    z-index: 1;
}

form {
    background-color: rgba(225, 225, 225, 0.2);
    animation: brillo 2s ease-in-out infinite alternate;
    color: #fff;
    align-content: center;
    border: 3px solid #ccc;
    border-radius: 10px;
    width: 500px;
    height: auto;
    margin: 10px;
    padding: 70px;
}



.cristal {
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;

}

.line {
    border-left: 2px solid #ccc;
    height: 300px;
    margin: 0px 60px 0px 60px;
}

.alingbutton {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ccc;
    color: #145474;

}

.alingbutton global-btn {

    width: 100%;
    max-width: 200px;
}

.global-btn ::btn_global {
    font-family: 'Courier New', Courier, monospace;
}

@media (max-width: 930px) {
    .container {
        flex-direction: column;
    }

    .img_palace {
        max-width: 100%;
        margin-right: 0;
        margin-bottom: 20px;
    }

    .cristal {
        max-width: 100%;
    }
}


.input-container {
    display: flex;
    align-items: center;
}

.input-wrapper {
    flex: 1;
    position: relative;
}

.password-icon {
    position: absolute;
    right: 10px;
    top: 40%;
    transform: translateY(-50%);
}

.cristal-container {
    position: relative;
    margin-bottom: 20px;
}

.circle {
    position: absolute;
    top: -32px;
    left: calc(50% - 32px);
    background-color: #333;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>