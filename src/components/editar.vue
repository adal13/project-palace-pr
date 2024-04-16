<template>
    <h1>Editar usuario</h1>
    <router-link to="/Home">
        <v-icon class="back-icon">mdi-arrow-left</v-icon>
    </router-link>
    <div class="form-container">
        <form @submit.prevent="">
            <div>
                <input-global title="" name="user" :value="userID.user"
                    @update:value="newValue => updateIUsers('user', newValue)" />
                <input-global title="" name="email" :value="userID.email"
                    @update:value="newValue => updateIUsers('email', newValue)" />
                <div>
                    <v-select title="" id="UserRol" :items="['ADMIN', 'INVITADO']" v-model="selectedOption"
                        style="width: 650px;" />
                </div>

                <div>
                    <global-btn btn_global="actualizar" type="submit" @click="addEdit" />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { usedataStore } from '../store/datoUsuario';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../ampliconfig';
import { Amplify } from 'aws-amplify';
import { IdUsuario } from '../types/index';
import { onMounted, ref } from 'vue';
import { inputGlobal } from '../importFile';
import { globalBtn } from '../importFile';
import router from '../router/router';

const dataStore = usedataStore()
Amplify.configure(amplifyConfig);

const props = defineProps(['id']);// Usuario seleccionado para edición
const userID = ref<IdUsuario>({ id: '', user: '', email: '', role: '' });
const selectedOption = ref('select...');

let roleUser;
async function getLogin() {
    try {
        const getUser = await API.get({
            apiName: 'access_API',
            path: `/dev/users/findById/${props.id}`,
            options: {
                body: {
                    message: 'data'
                }
            }
        });
        const { body } = await getUser.response;
        if (body) {
            const data = await body.json() as { data?: void };
            userID.value = data.data as unknown as IdUsuario
            dataStore.userEdit(userID.value)

            roleUser = userID.value.role

            if (typeof roleUser === 'string') {
                selectedOption.value = roleUser;
            }

        } else {
            console.log('sin respuesta')
        }
    } catch (error) {
        console.log('sin obtener datos', error);

    } finally {

    }
};



const saveUsers = async () => {
    try {
        const restOperation = await API.put({
            apiName: "access_API",
            path: `/dev/users/update/${props.id}`,
            options: {
                body: {
                    user: userID.value.user as string,
                    email: userID.value.email as string,
                    role: selectedOption.value
                }


            }
        });

        const role = selectedOption.value;
        console.log("Rol asignado al usuario", role)

        const response = await restOperation.response;
        console.log('PUT call succeeded: ', response);
    } catch (error) {
        console.log('PUT call failed: ', error);
    }
};

const updateIUsers = (fielName: string, value: string) => {
    userID.value = { ...userID.value, [fielName]: value }
}

const addEdit = async (fielName: string, value: string) => {
    updateIUsers(fielName, value)
    await saveUsers()
    router.push('/Users')
    dataStore.reset()
}
onMounted(getLogin)
</script>



<style scoped>
form {
    border-radius: 13px;
    max-width: 100%;
    height: auto;
    padding: 20px;
    margin: 15px;
    position: center;
    background-color: white;
    box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.2);
    text-transform: none;
}

h1 {
    margin-left: 30px;
}

.back-icon {
    margin-left: 30px;
    margin-right: 5px;
    /* vertical-align: middle; */
    /* margin-top: 0px;
    display: flex; */
}

form:hover {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.9);
}

.form-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
}

.input-selected {
    width: 550px;
    height: 55px;
    border-radius: 4px;
    background-color: #fff;
    font-size: 16px;
}
</style>