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
            <!-- <div class="input-container"> -->
            <v-icon icon="mdi-account" color="#fff" size="30" class="icon"></v-icon>
            <input-global title="" name="Nombre de usuario" v-model="loginDetails.user"
                @update:value="newValue => updateI('user', newValue)" />
            <!-- </div> -->


            <v-icon icon="mdi-lock" color="#fff" size="30" />
            <input-global title="" name="Contraseña" v-model="loginDetails.password"
                @update:value="newValue => updateI('password', newValue)" />
            <div class="alingbutton">
                <global-btn type="submit" btn_global="Iniciar sesion" />
            </div>
            <p v-if="errorMessages">{{ errorMessages }}</p>
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

const errorMessages = ref('')

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
                    'ADMIN': '/users',
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
    align-items: center;
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


/* .input-container {
    display: flex;
    align-items: center;
}

.input-container .icon {
    margin-right: 10px;
} */
</style>