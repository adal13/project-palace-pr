<template>
    <div>
        <h1>Responsables</h1>
    </div>
    <v-expansion-panels>
        <v-expansion-panel v-for="(result, index) in dataStore.dataResponsible[0]" :key="index"
            @click="togglePanel(result)">
            <template v-slot:title>
                <v-row align="center" justify="space-between">
                    <v-col>
                        <span>Responsable: {{ result.user }}</span>
                    </v-col>
                    <v-col>
                        <span v-if="Array.isArray(result.credential) && result.credential.length > 0">Cantidad de
                            credenciales: {{ result.credential.length
                            }}</span>
                        <span v-else>No hay credenciales</span>
                    </v-col>
                </v-row>
            </template>
            <v-card v-if="result.cardHidden">
                <v-card-text>
                    <!-- <v-list> -->
                    <v-list-item-content v-for="(credential, index) in result.credential" :key="index">
                        <v-list-item>
                            <v-list-item-title @click="togglePanel(credential)" class="user-iam-title">
                                <strong>Usuario IAM:</strong>
                                {{ credential.iam_user_name }}
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item-content v-if="credential.expanded">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title v-if="credential.status !== undefined">Estado: {{
            credential.status }}</v-list-item-title>
                                    <v-list-item-title v-else>Credential: 0</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title v-if="credential.date_delete !== undefined">Fecha de expiracion:
                                        {{
            credential.date_delete }}</v-list-item-title>
                                    <v-list-item-title v-else>Credential: 0</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                        </v-list-item-content>
                    </v-list-item-content>
                </v-card-text>
            </v-card>
        </v-expansion-panel>

    </v-expansion-panels>



    <!-- <div>
        <tablegbl :columns="columns" :data="dataTable" :showButtonEditar="false" :showButtonEliminar="false"
            :showButtonVisualize="true" :showButtonEliminarIAM="true" />
    </div> -->

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usedataStore } from '../../store/datoUsuario';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';
import { userResponsible } from '../../types/index'
// import { DocumentType } from '@aws-amplify/core/internals/utils';

Amplify.configure(amplifyConfig)
const dataStore = usedataStore()

const usersResponsible = ref<userResponsible[]>([])

// const togglePanel = (result: any) => {
//     result.expanded = !result.expanded;
// };

// const toggleCredential = (credential: any) => {
//     credential.expanded = !credential.expanded;
// };

const togglePanel = (credential: any) => {
    if (!credential.expanded) {
        credential.cardHidden = !credential.cardHidden; // Cambia el estado cardHidden solo si el nombre se expande
    }
    credential.expanded = !credential.expanded; // Cambia el estado expanded al hacer clic en el nombre
};

// let resultRes: string | number | boolean | DocumentType[] | { [prop: string]: DocumentType; } | null;
// let resultCredential: string | number | boolean | DocumentType[] | { [prop: string]: DocumentType; } | null;

// obtencion de usuariosIAM desde JSON
const getResponsible = async () => {
    try {
        const getUser = await API.get({
            apiName: 'access_API',
            path: '/dev/users/findAllUserWithCredential',
            options: {
                body: {
                    message: 'ingresado',
                }
            }
        });
        const { body } = await getUser.response;
        const data = await body?.json();
        console.log('getuserRes', data);

        if (data !== null && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
            usersResponsible.value = data.data as unknown as userResponsible[];
            dataStore.userResponsible(usersResponsible.value)

            console.log("salkdfjkldsjfas", dataStore.dataResponsible)
        } else {
            usersResponsible.value = []
        }
    } catch (error) {
        console.log('sin obtener datos', error);
    } finally {
    }
};
onMounted(() => {
    getResponsible();
    // creatUserIAM()
})

// const columns = [
//     { label: 'Usuarios', key: 'users' },
//     { label: 'Credenciales', key: 'iam_user_name' },
//     { label: 'Estado', key: 'status' },
//     { label: 'Fecha de expiracion', key: 'date_delete' },

// ];

// const dataTable = computed(() => dataStore.dataResponsible);
// const dataTable = dataStore.dataResponsible;
// let datos;

// let datos = dataTable.forEach(items => {
//     console.log("items", items)
// })
// const dataTable = computed(() => dataStore.dataResponsible);

</script>

<style scoped></style>