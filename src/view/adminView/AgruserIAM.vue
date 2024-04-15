<template>
    <h1>Agregar usuario IAM</h1>
    <form @submit.prevent="AddnewUser">
        <div>
            <input-global title="" type="text" id="userName" v-model="usuarioIAM.userName"
                @update:value="newValue => updateI('userName', newValue)" name="nombre de usuario" />
        </div>
        <div>
            <global-btn btn_global="Regitrar" :stop-event="true" @click="createJSON" />
        </div>
    </form>
</template>


<script lang="ts" setup>
import { inputGlobal } from '../../importFile';
import { globalBtn } from '../../importFile';
// import { ref } from 'vue';
import { usedataStore } from '../../store/datoUsuario';
import amplifyConfig from '../../ampliconfig';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import { ref } from 'vue';
// import { IduserIAM } from '../../types';

const dataStore = usedataStore();
Amplify.configure(amplifyConfig);

interface UsuarioAgrIAM {
    userName: String
};
const usuarioIAM = ref<UsuarioAgrIAM>({
    userName: ''
})


const createJSON = async () => {
    try {
        await API.post({
            apiName: 'access_API',
            path: '/dev/iam/create',
            options: {
                body: usuarioIAM.value.userName as string
            }
        });

    } catch (error) {
        console.log('create call failed: ', error);

    } finally {

    }
};
const updateI = (fielName: string, value: string) => {
    usuarioIAM.value.userName = { ...usuarioIAM.value.userName, [fielName]: value }
    console.log('datos agregados', usuarioIAM.value.userName)
}

// enviar los datos del formulario a mi store 
function AddnewUser() {
    dataStore.saveDataIAMs({
        inputEvent: {
            UserName: usuarioIAM.value.userName,
        }
    })
    console.log('usuario agregado', AddnewUser)
};
</script>


<style scoped>
form {
    border: 3px solid #ccc;
    margin: 30px;
    border-radius: 15px;
    height: auto;
    width: 600px;
    background-color: white;
    align-content: center;
}

div {
    margin: 20px;
}

h1 {
    font-family: cursive;
    padding: 20px;
    font-style: italic;
    color: #666;
    text-align: left;
    letter-spacing: 1px;
}

button {
    margin-left: 40px;
}

v-select {
    border-radius: 15px;
}
</style>