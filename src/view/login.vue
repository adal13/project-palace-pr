<template>
    <div class="body">
        <div class="img_palace">
            <img src="../../public/img//palace_resorts_logo-removebg-preview2.png" alt="Imagen The palace company"
                class="img-center">
        </div>
        <div class="line"></div>
        <!-- <h1>The Palace Company </h1> -->

        <form @submit.prevent="handleLogin" class="cristal">
            <h2>Bienvenido</h2>

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
                    <!-- <v-icon icon="mdi-eye" color="#fff" size="30" class="password-icon"
                        @click="togglePasswordVisibility" /> -->

                    <!-- ejemplo de icono de contraseña  -->
                    <v-icon :icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'" color="#fff" size="30"
                        @click="togglePasswordVisibility" class="password-icon" />
                </div>
            </div>
            <div class="alingbutton">
                <global-btn type="submit" btn_global="INICIAR SESIÓN" />
            </div>

        </form>
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

Amplify.configure(amplifyConfig)
const dataStore = usedataStore()

const loginDetails = ref<inicioSesion>({
    user: '',
    password: '',
})

// const errorMessages = ref('')

const router = useRouter()

const handleLogin = async () => {
    const hashedPassword = bcrypt.hashSync('password', 10)
    console.log('hashedpassword', hashedPassword)
    const passwordMatch = bcrypt.compareSync(loginDetails.value.password, hashedPassword)
    console.log('passwordMatch', passwordMatch)

    const authenticated = false
    console.log('tratando de enviar a otra pagina', authenticated)

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

                // console.log("auth, login", role)

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
        // alert(errorMessages)
    }
};

const updateI = (fielName: string, value: string) => {
    loginDetails.value = { ...loginDetails.value, [fielName]: value }
    // console.log('datos agregados', loginDetails.value)
}

// variable del ojito 

const passwordFieldType = ref('password');

const updatePassword = (newValue: string) => {
    loginDetails.value.password = newValue;
};

const togglePasswordVisibility = () => {
    passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

const passwordVisible = false
// togglePasswordVisibility() {
//   passwordVisible = !this.passwordVisible;
//     this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
// },

</script>

<style scoped>
.body {
    background-color: #145474;
    /* background-color: black; */
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    /* flex-direction: initial; */
}

/* checar si iria esta clase de imagen, debido a que esta tambien el body centrado y no seria necesario la class de img   */
.img_palace {
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 100vh; */
}

.img-center {
    width: 250px;
    height: 250px;
    /* max-width: 100%;
    max-height: 100%; */
    /* margin-right: 50%; */
}

h2 {
    font-family: Verdana, Tahoma, sans-serif;
    font-size: 40px;
    text-align: center;
    background: linear-gradient(to right, rgba(20,
                84,
                116,
                1), #fff 50%, #6C6B6C);
    /* box-shadow: 0 0 10px rgba(20, 84, 116, 1); */
    background-size: 200% auto;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient 3s linear infinite;
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
    /* flex: 1; */
}

/* @keyframes brillo { */
/* from {
        background-color: rgba(225, 225, 225, 0.2);
        box-shadow: 0 0 10px rgba(225, 225, 225, 0.2);
        /* Añade sombra para el efecto de brillo */
/* }  */

/* to {
        background-color: rgba(225, 225, 225, 0.8);
        /* Ajusta el valor de opacidad según sea necesario */
/* box-shadow: 0 0 20px rgba(225, 225, 225, 0.8); */
/* Ajusta el tamaño de la sombra según sea necesario */
/* }  */
/* } */


.cristal {
    /* Fondo con color semi-transparente */
    background-color: rgba(255, 255, 255, 0.2);
    /* Blanco semi-transparente */
    /* Ajusta el valor alfa (0.5) según la opacidad deseada */

    /* Borde con sombra para resaltar el efecto de cristal */
    border: 1px solid rgba(255, 255, 255, 0.1);
    /* Borde blanco semi-transparente */
    /* Ajusta el valor alfa (0.2) según la opacidad deseada */

    /* Sombra para resaltar el efecto de cristal */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    /* Sombra con opacidad (0.2) */
}

.line {
    border-left: 2px solid #ccc;
    height: 300px;
    /* Altura de la línea vertical */
    margin: 0px 60px 0px 60px;
    /* Espacio entre la línea y los elementos */
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
    /* El botón ocupará todo el ancho del contenedor */
    max-width: 200px;
    /* Esto limita el ancho máximo del botón para que no sea demasiado ancho en pantallas grandes */
}

.global-btn ::btn_global {
    font-family: 'Courier New', Courier, monospace;
}

@media (max-width: 930px) {
    .container {
        flex-direction: column;
        /* Cambia a columna en pantallas más pequeñas */
    }

    .img_palace {
        max-width: 100%;
        /* Ancho máximo completo en pantallas más pequeñas */
        margin-right: 0;
        /* Elimina el margen */
        margin-bottom: 20px;
        /* Espacio entre la imagen y el formulario */
    }

    .cristal {
        max-width: 100%;
        /* Ancho máximo completo en pantallas más pequeñas */
    }
}



/* .demo__text {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: translateY(20px);
    will-change: opacity, transform;
    pointer-events: none;
}

.demo.s--processing .demo__text {
    transition: all 0.4s
}

.demo__text--step-0 {
    opacity: 1;
    transform: translateY(0);
}

.demo__text-dots::before,
.demo__text-dots:after {
    content: ".";
    opacity: 0;
}

@keyframes dotAnimation {

    10%,
    90% {
        opacity: 0;

    }

    40%,
    60% {
        opacity: 1;
    }
}

@keyframes dotAnimation {

    10%,
    90% {
        opacity: 0;
    }

    40%,
    60% {
        opacity: 1;
    }
} */


/* .input-container {
    position: relative;
    display: flex;
    align-items: center;
} */
/* 
.password-input-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
} */
/* 
.input-container {
    position: absolute;
} */

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
    /* ajusta la posición según tu diseño */
    top: 40%;
    /* ajusta la posición verticalmente según tu diseño */
    transform: translateY(-50%);
}
</style>