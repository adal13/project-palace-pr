<template>

    <div style="cursor: pointer;">

        <router-link v-if="client" to="/credentials">
            <v-icon class="back-icon">mdi-arrow-left</v-icon>
        </router-link>
        <router-link v-else to="/clientView">
            <v-icon class="back-icon">mdi-arrow-left</v-icon>
        </router-link>
    </div>
    <v-alert v-show="mostrarMensajeCredUserIAMs" :type="tipoDeAlerta" dismissible class="fade-out-message">
        {{ mensajeCredUserIAMs }}
    </v-alert>

    <global-btn btn_global="Agregar 2da credecial" class="btn_create2Credent" @click="createdCredSecond()"
        v-if="dataStore.role === 'ADMIN'" />

    <v-btn class="btn_credential" id="menu-activator" color="primary">Credenciales</v-btn>
    <v-menu activator="#menu-activator">
        <v-list>
            <v-list-item v-for="(secret, index) in dataStore.dataSecretIAM" :key="index" @click="toggleInfo">
                <v-list-item-title @click="handleShow(secret.iam_access_key, index)">Mostrar Secret Key {{
            index + 1
        }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>



    <v-btn class="btn_delete" color="red" @click="handleDeleteSelectedKeys"
        v-if="dataStore.role === 'ADMIN'">Eliminar</v-btn>

    <v-btn color="yellow" btn_global="Rotar" class="RotDate" @click="handleRotate"
        v-if="dataStore.role === 'ADMIN'">Rotar</v-btn>

    <div class="datesdel" v-for="(secret, index) in dataStore.dataSecretIAM" :key="index">

        <v-btn v-if="dataStore.role === 'ADMIN'" :color="buttonColor(index)" v-show="activeIndex === index && showMenu"
            class="ActDate" @click="ActDesctAccesKey(index)">{{ secret.status ===
            'Active' ?
            'Desactivar' : 'Activar' }}</v-btn>
    </div>

    <div class="container_table">
        <table class="style_table" id="tableIAM">

            <tbody class="tbody_style">
                <!-- Datos de usuario -->
                <tr>
                    <td>UserId</td>
                    <td>{{ userID?.UserId }}</td>
                </tr>
                <tr>
                    <td>UserName</td>
                    <td>{{ userID?.UserName }}</td>
                </tr>
                <tr>
                    <td>CreateDate</td>
                    <td>{{ userID?.CreateDate }}</td>
                </tr>
                <!-- Datos secretIAM -->
                <td v-show="showMenu">AccessKey</td>
                <td v-show="showMenu">
                    <tr class="datesdel" v-for="(secret, index) in dataStore.dataSecretIAM" :key="index">
                        <button rowspan="1" v-if="activeIndex === index">{{ secret.iam_access_key }}</button>
                    </tr>
                </td>
                <tr>
                    <td v-show="showMenu">SecretKey</td>
                    <td>
                <tr v-show="showMenu" class="datesdel" v-for="(secret, index) in dataStore.dataSecretIAM" :key="index">
                    <button rowspan="1" v-if="activeIndex === index">{{ secret.secret_access_key }}</button>
                </tr>
                </td>
                </tr>

            </tbody>
        </table>
    </div>

</template>

<script setup lang="ts">
import { usedataStore } from '../../store/datoUsuario';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';
import { Amplify } from 'aws-amplify';
import { onMounted, ref } from 'vue';
import { globalBtn } from '../../importFile';
import { IduserIAM, secretUserIAM } from '../../types/index';
import mostrarMensajeTempralCredUserIAMs, { mostrarMensajeCredUserIAMs, mensajeCredUserIAMs, tipoDeAlerta } from '../helper/mensaje'

Amplify.configure(amplifyConfig);


const dataStore = usedataStore()
const client = dataStore.role === 'ADMIN'
const activeIndex = ref(-1);
const showMenu = ref(false);
const selectedKey = ref<string | null>(null);


function handleShow(accessKey: string | undefined, index: number) {

    if (accessKey != undefined) {
        console.log('Mostrar', accessKey);
        activeIndex.value = index
        selectedKey.value = accessKey;
        showMenu.value = false;
    }
};
const toggleInfo = () => {
    showMenu.value = !showMenu.value;
};

function handleDeleteSelectedKeys() {
    console.log('Eliminar llaves seleccionadas:', selectedKey.value);

    if (selectedKey.value) {
        handleDeleteAccess(selectedKey.value);
        selectedKey.value = null;  // Limpia la selección después de la operación
    }
}

const handleRotate = () => {
    if (activeIndex.value !== -1) {
        const secret = dataStore.dataSecretIAM[activeIndex.value];
        creatUserIAM(secret.iam_access_key, secret.iam_user_name);
    }
};

const isActiveCredential = (index: number) => {
    if (activeIndex.value === index) {
        const secret = dataStore.dataSecretIAM[index];
        return secret.status === 'Active';
    }
    return false;
};

// Función para activar/desactivar la credencial seleccionada
const buttonColor = (index: number) => isActiveCredential(index) ? 'warning' : 'success';


const props = defineProps(['UserName', 'emits']);


const userID = ref<IduserIAM>();
const storeSecret = ref<secretUserIAM[]>([{ iam_access_key: '', iam_user_name: '', status: '' }])

const secretIAM = ref<secretUserIAM[]>([]);


console.log('secretIAM', secretIAM)


async function getLogin() {
    try {
        const getUser = await API.get({
            apiName: 'access_API',
            path: `/dev/iam/findById/${props.UserName}`,
            options: {
                body: {
                    message: 'data'
                }
            }
        });
        const { body } = await getUser.response;
        const secret = await body?.json();

        if (body) {
            const data = await body.json() as { data?: void };

            console.log('APPI', data);
            userID.value = data.data as unknown as IduserIAM
            dataStore.reset()
            dataStore.userEditIAM(userID.value)

        } else {
            console.log('sin respuesta')
        }
        if (secret !== null && typeof secret === 'object' && 'secret' in secret && Array.isArray(secret.secret)) {
            storeSecret.value = secret.secret as unknown as secretUserIAM[]
            dataStore.reset()
            storeSecret.value.forEach((secretDate) => {
                dataStore.userSecretIA(
                    secretDate.iam_access_key as string,
                    secretDate.iam_user_name as string,
                    secretDate.secret_access_key as string,
                    secretDate.status as string
                )


            })
        }
        console.log('dataStore', storeSecret)


    } catch (error) {
        console.log('sin obtener datos', error);

    } finally {

    }
};
onMounted(getLogin)

async function handleDeleteAccess(iam_access_key?: string) {
    try {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar el accessKey?');
        if (confirmDelete) {

            const deleteSecretKey = await API.del({
                apiName: "access_API",
                path: `/dev/iam/delete_credential/${props.UserName}/${iam_access_key}`,
            });

            const response = await deleteSecretKey.response

            if (response.statusCode === 200) {
                console.log('restoperation', deleteSecretKey)
                await deleteSecretKey.response

                const findResponse = await getLogin()
                toggleInfo()
                secretIAM.value.forEach((delSecret) => {
                    dataStore.deleteAccessKey(
                        delSecret.iam_user_name as string,
                        delSecret.iam_access_key as string
                    )

                })

                return findResponse
            }

        } else {
            console.log('Eliminación cancelada');
            toggleInfo()
        }
    } catch (error) {
        mostrarMensajeTempralCredUserIAMs('deleteCredentialErr', 'error')
        console.log('delete call failed: ', error);
    }
};

// rotar acces_key
const creatUserIAM = async (iam_access_key?: string, iam_user_name?: string) => {
    try {

        const restOperationRotate = await API.post({
            apiName: 'access_API',
            path: `/dev/iam/rotateCredential`,
            options: {
                body: {
                    iam_access_key: iam_access_key as string,
                    iam_user_name: iam_user_name as string
                }
            }

        });

        const response = await restOperationRotate.response

        if (response.statusCode === 200) {
            const findAllRest = await getLogin()
            console.log('rotate call succeeded');
            mostrarMensajeTempralCredUserIAMs('rotateCredential', 'success')
            return findAllRest
        }

    } catch (error) {

        mostrarMensajeTempralCredUserIAMs('rotateCredentialErr', 'error')
        console.log('rotate call failed: ', error);
    } finally {

    }
}

const ActDesctAccesKey = async (index: number) => {

    const secret = storeSecret.value[index];

    const currentState = secret.status

    secret.status = secret.status === 'Active' ? 'Inactive' : 'Active';

    try {
        // Envio de la solicitud POST para actualizar el accessKey
        const restOperationStatus = await API.put({
            apiName: 'access_API',
            path: `/dev/iam/status_credential/${props.UserName}`,
            options: {
                body: {
                    accessKeyId: secret.iam_access_key as string,
                    status: secret.status
                }
            }

        });

        const response = await restOperationStatus.response

        if (response.statusCode === 200) {
            const findAllRest = await getLogin()
            if (currentState === 'Active') {
                mostrarMensajeTempralCredUserIAMs('desactivateCredential', 'warning');
            } else {
                mostrarMensajeTempralCredUserIAMs('activateCredential', 'success');
            }
            return findAllRest
        }


    } catch (error) {
        mostrarMensajeTempralCredUserIAMs('activateCredentialErr', 'error')
        console.log('credential call failed: ', error);
    } finally {
    }
}

const createdCredSecond = async () => {
    try {
        const restOperationPut = await API.put({
            apiName: 'access_API',
            path: `/dev/iam/createdCred/${props.UserName}`,
            options: {
                body: {}
            }

        });

        const response = await restOperationPut.response

        if (response.statusCode === 200) {
            const findAllRest = await getLogin()
            mostrarMensajeTempralCredUserIAMs('create2Credential', 'success')
            return findAllRest
        }

    } catch (error: any) {
        if (error.response && error.response.statusCode === 409) {
            // Manejar el error 409 aquí
            mostrarMensajeTempralCredUserIAMs('exceededLimitCredential', 'error');
        } else {
            // Manejar cualquier otro error aquí
            console.log('rotate call failed: ', error);
            mostrarMensajeTempralCredUserIAMs('create2CredentialErr', 'error');
        }
    } finally {

    }
}

</script>
<style scoped>
.back-icon {
    margin-left: 30px;
    margin-right: 5px;
    vertical-align: middle;
}


/* estilos definidos  */
.style_table {
    padding: 1%;
    width: 100%;
    border-collapse: collapse;
    text-transform: none;
    display: flex;
    justify-content: center;
}

.tbody_style {
    width: 30%;
}


.style_table th,
.style_table td {
    border: 1px solid #ddd;
    padding: 8px;
    width: 100%;
}

.style_table th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: left;
}

.style_table td div {
    margin-bottom: 5px;
}

.custom-select {
    width: 500px;
    height: 55px;
    padding: 8px;
    margin-bottom: 25px;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    font-size: 16px;
}

.custom-select option {
    background-color: #fff;
    color: #145474;
}

.btn_create2Credent {
    background: blue;
    color: white;
    margin: 1%;
}

.btn_credential {
    margin: 1%;
}

.btn_delete {
    margin: 1%;
}

.RotDate {
    margin: 1%;
}

.ActDate {
    margin: 1%;
}
</style>
