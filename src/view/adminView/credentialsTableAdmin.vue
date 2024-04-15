<template>
   <v-alert v-show="mostrarMensajeCredUserIAMs" :type="tipoDeAlerta" dismissible class="fade-out-message">
      {{ mensajeCredUserIAMs }}
   </v-alert>

   <h1>Usuarios IAM</h1>
   <router-link to="/AgrNewCred">
      <global-btn btn_global="Agregar credencial" buttonClass="agrBtnCred" dark />
   </router-link>
   <global-btn btn_global="Crear credencial" buttonClass="regBtnCred" dark @click="dialog2 = true" />
   <global-btn btn_global="Crear usuario IAM" buttonClass="regBtnCred" dark @click="dialog3 = true" />

   <div>
      <tablegbl :columns="columns" :data="dataTable" :showButtonEditar="false" :showButtonEliminar="false"
         :showButtonVisualize="true" :showButtonEliminarIAM="true" @deleteIAM="handleDeleteIAM"
         @visualizeCredUser="handleVisualizeIAM" />
   </div>



   <!-- ventana modal para crear credenciales  -->
   <form @submit.prevent="AddnewCredUserIAM">
      <!-- <form > -->
      <v-dialog v-model="dialog2" max-width="600px">
         <v-card>
            <v-card-title>Crear Credencial de usuario IAM</v-card-title>
            <v-card-text>
               <div>
                  <select v-model="selectedUserName" id="user" @change="fillCreatCred">
                     <option value="">Seleccione un usuario...</option>
                     <option v-for="(dato, index) in userListWhitoutCred" :key="index" :value="dato.UserName">{{
                        dato.UserName
                     }}
                     </option>
                  </select>
               </div>
            </v-card-text>
            <v-card-actions>
               <div>
                  <v-btn color="primary" @click="CreateCredential">Guardar</v-btn>
               </div>
               <v-btn @click="dialog2 = false">Cancelar</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </form>


   <!-- ventana modal para crear un usuario IAM  -->
   <form @submit.prevent="AddnewUser">
      <v-dialog v-model="dialog3" max-width="600px">
         <v-card>
            <v-card-title>Crear Usuario IAM</v-card-title>
            <v-card-text>
               <div>
                  <input-global title="" type="text" id="userName" v-model="usuarioIAM.userName"
                     @update:value="newValue => updateIAM('userName', newValue)" name="nombre de usuario" />
               </div>

            </v-card-text>
            <v-card-actions>
               <div>
                  <v-btn color="primary" @click="createUserIAM">Guardar</v-btn>
               </div>
               <v-btn @click="dialog3 = false">Cancelar</v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </form>
</template>

<script setup lang="ts">
import { usedataStore } from '../../store/datoUsuario';
import { computed, ref, onMounted } from 'vue'
import { tablegbl } from '../../importFile';
import { globalBtn } from '../../importFile';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';
import { IduserIAM } from '../../types';
import { CredentRegistIAM } from '../../types';
import { userWithOutCredential } from '../../types'
import { inputGlobal } from '../../importFile';
import router from '../../router/router';
import mostrarMensajeTempralCredUserIAMs, { mostrarMensajeCredUserIAMs, mensajeCredUserIAMs, tipoDeAlerta } from '../mensaje'


Amplify.configure(amplifyConfig)
const dataStore = usedataStore()
const usersIAM = ref<IduserIAM[]>([])

// obtencion de usuariosIAM desde JSON
const getIAM = async () => {
   try {
      const getUser = await API.get({
         apiName: 'access_API',
         path: '/dev/iam/findAll',
         options: {
            body: {
               message: 'ingresado',
            }
         }
      });
      const { body } = await getUser.response;
      const data = await body?.json();
      console.log('getIAM', data);

      if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
         usersIAM.value = data.data as unknown as IduserIAM[];

         dataStore.reset();

         usersIAM.value.forEach((IAM) => {
            dataStore.userIAM(
               IAM.UserId as string,
               IAM.UserName as string,
               IAM.accessKeyId as string,
               IAM.CreateDate as string,
               IAM.Status as string,
               IAM.secretAcces as string,
               IAM.dateExpiration as string,
            )

         });
      } else {
         usersIAM.value = []
      }
   } catch (error) {
      console.log('sin obtener datos', error);
   } finally {
   }
};


const columns = [
   { label: 'Usuario IAM', key: 'UserName' },
   { label: 'Id Usuario', key: 'UserId' },
   { label: 'Llave de acceso IAM', key: 'accessKeyId' },
   { label: 'Estado', key: 'Status' },
   { label: 'Fecha de expiracion', key: 'dateExpiration' },
];

const dataTable = computed(() => dataStore.dataUsersIAM.slice(1));



// eliminar usuarios IAM que aparecen en las credenciales
async function handleDeleteIAM(UserName: string | number) {
   try {
      const restOperation = await API.del({
         apiName: "access_API",
         path: `/dev/iam/delete/${UserName}`,
      });
      console.log('restoperation', restOperation)

      const response = await restOperation.response
      if (response.statusCode === 200) {
         usersIAM.value = usersIAM.value.filter((row) => row.UserId !== UserName)
         console.log('iduser', usersIAM.value)

         dataStore.reset()
         // dataStore.clearUserIds();
         usersIAM.value.forEach((delUser) => {
            dataStore.userIAM(
               delUser.UserId as string,
               delUser.UserName as string,
               delUser.accessKeyId as string,
               delUser.CreateDate as string,
               delUser.Status as string,
               delUser.secretAcces as string,
               delUser.dateExpiration as string,
            )

         })
         console.log('user deleted successfully:', UserName);
         mostrarMensajeTempralCredUserIAMs('deleteUser', 'error')

      }

   } catch (error) {
      mostrarMensajeTempralCredUserIAMs('deleteUserError', 'error')
      console.log('delete call failed: ', error);
   }
};


// visualizar las credenciales de un usuario IAM 
const handleVisualizeIAM = (UserName: string | number) => {
   const userIAM = usersIAM.value.find(userIAM => userIAM.UserName === UserName)
   console.log('usuarios seleccionado', userIAM)
   if (UserName) {
      router.push({
         name: 'visualizeCredIAM',
         params: {
            UserName: userIAM?.UserName
         }
      })

   } else {
      console.error('Usuario no encontrado');
   }
}

// ventana modal para crear credenciales de usuarios IAM
const userListWhitoutCred = ref<userWithOutCredential[]>([]);
const dialog2 = ref(false);
const creatIAM = ref<userWithOutCredential>({
   UserName: '',

})

// obtencion del enlistado para creacion de credenciales a usuarios IAM 
const selectedUserName = ref<string>('');
const userListRegIAM = ref<CredentRegistIAM[]>([]);

async function getUsersIAM() {
   try {
      const getUser = await API.get({
         apiName: 'access_API',
         path: '/dev/iam/findAllWithoutCredential',
         options: {
            body: {
               message: 'ingresado',
            }
         }
      });

      const { body } = await getUser.response;
      const data = await body?.json();
      console.log('APPI', data);
      if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
         userListWhitoutCred.value = data.data as unknown as userWithOutCredential[];
         // dataStore.clearUserIds();
         console.log('usuario sin crdencial', userListWhitoutCred.value)
         userListWhitoutCred.value.forEach((IAMcredential) => {
            dataStore.CreadwhitOutCredentialIAM(
               IAMcredential.UserId as string,
               IAMcredential.UserName as string,
            )

         });
         // return getUsers
      } else {
         userListRegIAM.value = []
      }

   } catch (error) {
      console.log('sin obtener datos', error);
      console.log('sin obtener datos')

   } finally {
   }
};



const fillCreatCred = () => {
   // dataStore.reset()
   const selectedUser = userListWhitoutCred.value.find(user => user.UserName === selectedUserName.value);
   if (selectedUser) {
      creatIAM.value.UserName = selectedUser.UserName;
      // creatIAM.value.UserName = ''
   }
};

// Resetear el formulario y cualquier estado relacionado
function resetDialogData() {
   selectedUserName.value = '';
   creatIAM.value.UserName = '';  // Asegúrate de limpiar también aquí si es necesario
}

const closeDialog = () => {
   dialog2.value = false;
   resetDialogData(); // Llama a reset aquí para asegurarte de que todo se limpia
};



// ---------------------------------------------------------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------------------------------------------//

// creacion de credenciales 
const creatUserIAM = async () => {
   try {
      const restOperationPut = await API.put({
         apiName: 'access_API',
         path: `/dev/iam/createdCred/${creatIAM.value.UserName}`,

      });

      const response = await restOperationPut.response

      if (response.statusCode === 200) {

         // dataStore.reset()
         const getUserIAMref = await getIAM()
         mostrarMensajeTempralCredUserIAMs('credential', 'success');
         // dialog2.value = false; // Cierra la ventana modal
         closeDialog()
         // dataStore.reset()
         return getUserIAMref
      }

   } catch (error) {
      console.log('create call failed: ', error);
      dialog2.value = false
      mostrarMensajeTempralCredUserIAMs('createErrCredential', 'error');
      // mostrarMensajeTempralCredUserIAMs('createErrCredential')

   } finally {

   }
}
const listenUserIAM = (fielName: string, value: string) => {
   creatIAM.value = { ...creatIAM.value, [fielName]: value }
   console.log('creacion de credencial', creatIAM.value)
}
onMounted(() => {
   getUsersIAM();
   // creatUserIAM()
})

const CreateCredential = async (fielName: string, value: string) => {
   listenUserIAM(fielName, value)
   await creatUserIAM()
   // const getUserRefIam = await getUsersIAM()
   router.push('/credentials')
   // return getUserRefIam
}

function AddnewCredUserIAM() {
   dataStore.saveDataIAM(
      creatIAM.value.UserName as string
   )
}



// ---------------------------------------------------------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------------------------------------------------------//

// ventana modal para crear usuarios IAM
const dialog3 = ref(false);

interface UsuarioAgrIAM {
   userName: String
};
const usuarioIAM = ref<UsuarioAgrIAM>({
   userName: ''
})

const createUserIAM = async () => {
   try {
      const restOperationPost = await API.post({
         apiName: 'access_API',
         path: '/dev/iam/create',
         options: {
            body: usuarioIAM.value.userName as string
         }
      });

      const response = await restOperationPost.response
      if (response.statusCode === 200) {
         // mensajeCredUserIAM.value = 'Usuario IAM creado con exito'
         mostrarMensajeTempralCredUserIAMs('successCreateIAM', 'success');
         dialog3.value = false

         const getUsersDataIam = await getUsersIAM()


         return getUsersDataIam

      }

   } catch (error) {
      console.log('create call failed: ', error);
      dialog3.value = false
      mostrarMensajeTempralCredUserIAMs('createUserError', 'error')
   } finally {

   }
};
const updateIAM = (fielName: string, value: string) => {
   usuarioIAM.value.userName = { ...usuarioIAM.value.userName, [fielName]: value }
   console.log('datos agregados', usuarioIAM.value.userName)
}

// enviar los datos del formulario a mi store 
function AddnewUser() {
   dataStore.saveDataIAMs({
      inputEvent: {
         userName: usuarioIAM.value.userName,
      }
   })
   console.log('usuario agregado', AddnewUser)
};




onMounted(() => {
   getIAM()
})


</script>

<style>
h1 {
   padding-left: 5%;
}

.modal {
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   overflow: auto;
   background-color: rgb(20, 84, 116, 0.2);
}

/* Estilos del contenido de la modal */
.modal-content {
   align-items: center;
   background-color: #fefefe;
   margin: 10% auto;
   padding: 20px;
   border: 1px solid #888;
   width: 80%;
   max-width: 700px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
   /* Sombra */
}



.agrBtnCred {
   background-color: #145474;
   font-size: 13px;
   color: white;
   border-radius: 10px;
   height: auto;
   width: auto;
   text-decoration: none;
   position: relative;
   margin-left: 5%;
   margin-top: 50px;
}

.regBtnCred {
   background-color: white;
   font-size: 13px;
   color: #145474;
   border-radius: 10px;
   border: 2px solid rgb(196, 194, 194);
   height: auto;
   width: auto;
   text-decoration: none;
   position: relative;
   margin-top: 50px;
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
</style>