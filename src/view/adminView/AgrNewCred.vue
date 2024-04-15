<template>
    <h1>Agregar credenciales</h1>
    <v-alert v-show="mostrarMensajeAgr" type="success" dismissible class="fade-out-message">
        {{ mensajeAgr }}
    </v-alert>
    <v-alert v-show="mostrarMensajeAgrError">{{ mensajeAgrError }}</v-alert>

    <v-container class="d-flex align-center justify-center">

        <form @submit.prevent="AgrnewCredUserIAM">
            <div>
                <div class="select-container">
                    <select v-model="selectedUserName" id="user" @change="filterAgrCredUser" class="input-select">
                        <option value="">Seleccione un usuario IAM...</option>
                        <option v-for="datos in userListRegIAM" :key="datos.UserName" :value="datos.UserName">{{
        datos.UserName
    }}
                        </option>
                    </select>
                </div>
                <!-- Contenido del formulario para agregar la credencial -->
                <input-global title="" name="Id de usuario " :value="registCredential.UserId"
                    @update:value="newValue => updateAgrCred('UserId', newValue)" style="pointer-events: none;" />

                <input-global title="" name=" Llave de accesos IAM" :value="registCredential.accessKeyId"
                    @update:value="newValue => updateAgrCred('accessKeyId', newValue)" style="pointer-events: none;" />

                <input-global title="" name="Llave secreta" :value="registCredential.secretAccess"
                    @update:value="newValue => updateAgrCred('secretAccess', newValue)" style="pointer-events: none;" />

                <input-global title="" name="Fecha de expiracion" :value="registCredential.dateExpiration"
                    @update:value="newValue => updateAgrCred('dateExpiration', newValue)"
                    style="pointer-events: none;" />



                <!-- asignacion de usuario para agregar sus credenciales  -->
                <h2>¿Asignar a...?</h2>
                <div>
                    <select v-model="selectedUserGuest" id="user" @change="filterUserGuest" class="input-select">
                        <option value="">Seleccione un usuario...</option>
                        <option v-for="dato in  userGuest" :key="dato.user" :value="dato.user">{{
        dato.user
    }}
                        </option>
                    </select>
                    <input-global title="" name="id de usuario" :value="registUser.id"
                        @update:value="newValue => updateUserGuest('id', newValue)" style="pointer-events: none;" />
                </div>
                <div>
                    <global-btn btn_global="Guardar" color="primary" @click="AgrCredential" buttonClass="styleBUser" />
                </div>
            </div>
        </form>
    </v-container>
</template>

<script setup lang="ts">
import { CredentRegistIAM } from '../../types';
import { ref, onMounted } from 'vue';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';
import { usedataStore } from '../../store/datoUsuario';
import router from '../../router/router';
import { inputGlobal } from '../../importFile';
import { globalBtn } from '../../importFile';

Amplify.configure(amplifyConfig)
const dataStore = usedataStore()


// mensaje de accion credencial agregado
const mensajeAgr = ref('');
const mostrarMensajeAgr = ref<boolean>(false);
const mostrarMensajeTempralAgr = () => {
    mostrarMensajeAgr.value = true;
    setTimeout(() => {
        mostrarMensajeAgr.value = true;
    }, 6000); // Ocultar el mensaje después de 3 segundos (3000 milisegundos)
}

// mensaje de error a la credencial agregado
const mensajeAgrError = ref('');
const mostrarMensajeAgrError = ref<boolean>(false);
const mostrarMensajeTempralAgrError = () => {
    mostrarMensajeAgrError.value = true;
    setTimeout(() => {
        mostrarMensajeAgrError.value = true;
    }, 6000); // Ocultar el mensaje después de 3 segundos (3000 milisegundos)
}

const selectedUserName = ref<string>('');
const userListRegIAM = ref<CredentRegistIAM[]>([]);
const registCredential = ref<CredentRegistIAM>({
    UserName: '',
    accessKeyId: '',
    secretAccess: '',
    dateExpiration: ''
})

// obtencial de datos de las credenciales a agregar 
async function fetchUsersData() {
    try {
        const getUserIAM = await API.get({
            apiName: 'access_API',
            path: `/dev/iam/findAllWithCredential`,
            options: {
                body: "message"
            }
        });
        const { body } = await getUserIAM.response;
        const data = await body?.json();
        console.log('getUserIAM', data);
        if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {

            userListRegIAM.value = data.data as unknown as CredentRegistIAM[];
            // console.log('usuarios con credenciales', userListRegIAM.value)

            dataStore.clearUserIds();
            userListRegIAM.value.forEach((IAMcredential) => {
                dataStore.registCredentialIAM(
                    IAMcredential.UserId as string,
                    IAMcredential.UserName as string,
                    IAMcredential.accessKeyId as string,
                    IAMcredential.secretAccess as string,
                    IAMcredential.dateExpiration as string,
                )
            });
        } else {
            userListRegIAM.value = []
        }
    } catch (error) {
        // console.error('sin obtener el enlistado de credencial :', error);
        console.error('Error fetching users:', error);
    }
};

// filtro de id de las credenciales creadas
const filterAgrCredUser = () => {
    const selectedUser = userListRegIAM.value.find(user => user.UserName === selectedUserName.value);
    if (selectedUser) {
        registCredential.value.UserName = selectedUser.UserName;
        registCredential.value.UserId = selectedUser.UserId;
        registCredential.value.accessKeyId = selectedUser.accessKeyId;
        registCredential.value.secretAccess = selectedUser.secretAccess;
        registCredential.value.dateExpiration = selectedUser.dateExpiration;
    }
};

onMounted(() => {
    // registerCredIAMuser()
    fetchUsersData();
});
function AgrnewCredUserIAM() {
    dataStore.saveRegCredentialIAM(
        registCredential.value.UserName as string,
    )
    ClearUser()
}
function ClearUser() {
    registCredential.value.UserName = '';
    registCredential.value.accessKeyId = '';
    registCredential.value.secretAccess = '';
    registCredential.value.dateExpiration = '';
    registCredential.value.UserId = '';

}


// enlistado de usuario invitado
const selectedUserGuest = ref<string>('');
import { IdUsuario } from '../../types';
const userGuest = ref<IdUsuario[]>([])



async function getGuestUsers() {
    try {
        const getUser = await API.get({
            apiName: 'access_API',
            path: `/dev/users/findByTipoUser`,
            options: {
                body: "message"
            }
        });
        const { body } = await getUser.response;
        const data = await body?.json();
        console.log('obtencion de datos de usuarios normales', data);
        if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {

            userGuest.value = data.data as unknown as IdUsuario[];
            // console.log('usuarios con credenciales', userListRegIAM.value)

            // dataStore.clearUserIds();
            userGuest.value.forEach((guestUser) => {
                dataStore.userJson(
                    guestUser.id as string,
                    guestUser.user as string,
                    guestUser.email as string,
                    guestUser.password as string,
                    guestUser.role as string,
                )
            });
        } else {
            userGuest.value = []
        }
    } catch (error) {
        // console.error('sin obtener el enlistado de credencial :', error);
        console.error('Error fetching users:', error);
    }
};
onMounted(() => {
    getGuestUsers();
});

const registUser = ref<IdUsuario>({
    id: '',
    user: '',
})

// filtro de id de las credenciales creadas
const filterUserGuest = () => {
    const userGuestSelected = userGuest.value.find(user => user.user === selectedUserGuest.value);
    if (userGuestSelected) {
        registUser.value.user = userGuestSelected.user;
        registUser.value.id = userGuestSelected.id;
    }
};
const updateUserGuest = (fielName: string, value: string) => {
    registUser.value = { ...registUser.value, [fielName]: value }
    console.log('datos agregados', registUser.value)
}



// metod put para enviar los datos para la asignacion de usuarios IAM por cada usuario local
const registerCredIAMuser = async () => {
    try {
        const response = await API.put({
            apiName: 'access_API',
            path: `/dev/iam/addListIam/${registCredential.value.UserName}/${registUser.value.id}`,
        });
        console.log('agregar informacion cred', response)

        mostrarMensajeTempralAgr()
        mensajeAgr.value = 'Credencial agregado exitosamente'

    } catch (error) {
        console.log('agregate call failed: ', error);
        mostrarMensajeTempralAgrError()
        mensajeAgrError.value = 'Error: La credencial no fue agregada con exito'

    } finally {

    }
}
const updateAgrCred = (fielName: string, value: string) => {
    registCredential.value = { ...registCredential.value, [fielName]: value }
    registUser.value = { ...registUser.value, [fielName]: value }
}

const AgrCredential = async (fielName: string, value: string) => {
    updateAgrCred(fielName, value)
    await registerCredIAMuser()
    router.push('/credentials')
}
</script>



<style scoped>
body {
    text-transform: none;
}

form {
    border-radius: 13px;
    min-width: 60%;
    height: auto;
    padding: 20px;
    margin: 15px;
    position: center;
    background-color: white;
    box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.2);
    text-transform: none;
    /* font-family: Arial; */
}

form:hover {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.9);
}

.align-center {
    align-items: center;
}

.justify-center {
    justify-content: center;
}

.d-flex {
    display: flex;
}

.styleBUser {
    background-color: #145474;
    font-size: 13px;
    color: white;
    border-radius: 10px;
    height: 40px;
    width: 140px;
    margin-top: 5px;
    position: relative;

}

.input-select {
    width: 100%;
    /* width: 500px;
    height: 55px; */
    padding: 8px;
    margin-bottom: 25px;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    font-size: 16px;
}

.input-select option {
    background-color: #fff;
    color: #145474;
}




/* clases de prueba  */

.select-container {
    flex: 1;
    /* Toma el espacio restante disponible */
}

/* .input-select {
    width: 100%;
} */
</style>