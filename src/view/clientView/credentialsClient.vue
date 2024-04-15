<template>
    <H1>Esta vista es de usuarios IAM que visualizara el cliente</H1>
    <div>
        <tablegbl :columns="columns" :data="dataTable" :showButtonEditar="false" :showButtonEliminar="false"
            :showButtonVisualize="true" />
    </div>
</template>

<script setup lang="ts">
import { usedataStore } from '../../store/datoUsuario';
import { computed, ref } from 'vue'
import { tablegbl } from '../../importFile';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';
import { IduserIAM } from '../../types';


Amplify.configure(amplifyConfig)
const dataStore = usedataStore()
const usersIAMClient = ref<IduserIAM[]>([])

// obtencion de usuariosIAM desde JSON
async function getIAM() {
    try {
        // enlistado de credenciales dependiendo de el usuario que inicio sesion 
        const userID = dataStore.id_user
        const getUser = await API.get({
            apiName: 'access_API',
            path: `/dev/iam/getUserCredential/${userID}`,
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
            usersIAMClient.value = data.data as unknown as IduserIAM[];
            console.log('iduser', usersIAMClient.value)

            dataStore.reset()
            usersIAMClient.value.forEach((IAM) => {

                dataStore.userIAM(
                    IAM.UserId as (string),
                    IAM.UserName as (string),
                    IAM.accessKeyId as (string),
                    IAM.CreateDate as (string),
                    IAM.Status as (string),
                    IAM.dateExpiration as (string),
                    IAM.secretAcces as (string)
                )

            });
        } else {
            usersIAMClient.value = []
        }
    } catch (error) {
        console.log('sin obtener datos', error);
        console.log('sin obtener datos')

    } finally {

    }
};
getIAM()


const columns = [
    { label: 'Id Usuario', key: 'UserId' },
    { label: 'Usuario IAM', key: 'UserName' },
    { label: 'Llave de acceso IAM', key: 'accessKeyId' },
    { label: 'Estado', key: 'Status' },
];

const dataTable = computed(() => dataStore.dataUsersIAM.slice(1));

</script>

<style scoped></style>