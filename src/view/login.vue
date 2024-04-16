<template>
    <div class="body">
        <!-- simulacio de cargar  -->
        <div id="loader-container">
            <div id="loader"></div>
        </div>


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

                <!-- circulo arriba del login  -->



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
import { onMounted } from 'vue'


// simulacion de carga 
const loaderContainer = ref<HTMLElement | null>(null);

onMounted(() => {
    loaderContainer.value = document.getElementById('loader-container');

    if (loaderContainer.value) {
        // Mostrar la barra de carga al 100% al cargar la página
        loaderContainer.value.style.display = 'block';
        // Simular el tiempo de carga
        setTimeout(() => {
            if (loaderContainer.value) {
                loaderContainer.value.style.display = 'none'; // Ocultar la barra de carga
            }
        }, 2000); // Duración de la animación en milisegundos (en este ejemplo, 2 segundos)
    }
});

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
/* simulacion de carga */
#loader-container {
    width: 100%;
    height: 4px;
    /* Altura de la barra de carga */
    background-color: #ddd;
    /* Color de fondo de la barra de carga */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: none;
    /* Ocultar la barra de carga inicialmente */
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

.demo.text--processing .demo__text {
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

/* circulo del login  */
.cristal-container {
    position: relative;
    margin-bottom: 20px;
    /* Espacio entre el círculo y el formulario */
}

.circle {
    position: absolute;
    top: -32px;
    /* Posición del círculo encima del formulario */
    left: calc(50% - 32px);
    /* Centrar horizontalmente el círculo */
    background-color: #333;
    /* Color de fondo del círculo */
    border-radius: 50%;
    /* Hacer el círculo */
    width: 80px;
    /* Ancho del círculo */
    height: 80px;
    /* Alto del círculo */
    display: flex;
    justify-content: center;
    /* Centrar el contenido horizontalmente */
    align-items: center;
}


/* .user-icon {
    font-size: 50px;
} */

/* Estilos adicionales para el formulario */
</style>