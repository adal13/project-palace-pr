<template>
    <h1>Agregar usuario</h1>
    <form @submit.prevent="AddnewUser">
        <div>
            <input-global title="" type="text" id="UserName" v-model="UsuarioAgr.user"
                @update:value="newValue => updateI('user', newValue)" name="nombre de usuario" />
        </div>
        <div>
            <input-global title="" type="email" id="UserEmail" v-model="UsuarioAgr.email"
                @update:value="newValue => updateI('email', newValue)" name="email" />
        </div>
        <div>
            <input-global title="" type="password" id="password" v-model="UsuarioAgr.password"
                @update:value="newValue => updateI('password', newValue)" name="password" />
        </div>
        <div>
            <!-- <UserRol type="text" id="UserRol" v-model="UsuarioAgr.role" /> -->
            <v-select title="" id="UserRol" :items="['admin', 'invitado']" v-model="selectedOption" />
        </div>
        <div>
            <global-btn btn_global="Regitrar" :stop-event="true" @click="createJSON" />
        </div>
    </form>
</template>


<script lang="ts" setup>
import { inputGlobal } from '../../importFile';
import { globalBtn } from '../../importFile';
import { ref } from 'vue';
import { usedataStore } from '../../store/datoUsuario';
import amplifyConfig from '../../ampliconfig';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import { IdUsuario } from '../../types';

const dataStore = usedataStore();
Amplify.configure(amplifyConfig);

const UsuarioAgr = ref<IdUsuario>({
    id: '',
    user: '',
    email: '',
    password: '',
    role: '',
});

const selectedOption = ref('select...');

const createJSON = async () => {
    try {
        await API.post({
            apiName: 'access_API',
            path: '/dev/users/create',
            options: {
                body: {
                    user: UsuarioAgr.value.user as string,
                    email: UsuarioAgr.value.email as string,
                    password: UsuarioAgr.value.password as string,
                    role: selectedOption.value
                    // role: UsuarioAgr.value.role
                }
            }
        });

    } catch (error) {
        console.log('create call failed: ', error);

    } finally {

    }
};
const updateI = (fielName: string, value: string) => {
    UsuarioAgr.value = { ...UsuarioAgr.value, [fielName]: value }
    console.log('datos agregados', UsuarioAgr.value)
}

// enviar los datos del formulario a mi store 
function AddnewUser() {
    dataStore.saveData({
        user: UsuarioAgr.value.user,
        email: UsuarioAgr.value.email,
        password: UsuarioAgr.value.password,
        role: UsuarioAgr.value.role,
    })
    console.log(UsuarioAgr.value.user || '')
    // console.log(UsuarioAgr.value.user)  
    console.log(UsuarioAgr.value.email)
    console.log(UsuarioAgr.value.password)
    console.log(UsuarioAgr.value.role)
};
// para regresar campos vacios despues de registrar 
// UsuarioAgr.value.user= '',
// UsuarioAgr.value.email= '',
// UsuarioAgr.value.password= '',
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