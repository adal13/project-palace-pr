<template>
    <div>
        <h1>Responsables</h1>
    </div>
    <v-expansion-panels>
        <v-expansion-panel v-for="(result, index) in dataStore.dataResponsible" :key="index"
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
                                        {{ credential.date_delete }}</v-list-item-title>
                                    <v-list-item-title v-else>Credential: 0</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                        </v-list-item-content>
                    </v-list-item-content>
                </v-card-text>
            </v-card>
        </v-expansion-panel>

    </v-expansion-panels>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usedataStore } from '../../store/datoUsuario';
import { Amplify } from 'aws-amplify';
import * as  API from 'aws-amplify/api';
import amplifyConfig from '../../ampliconfig';

Amplify.configure(amplifyConfig)
const dataStore = usedataStore()

const togglePanel = (credential: any) => {
    if (!credential.expanded) {
        credential.cardHidden = !credential.cardHidden;
    }
    credential.expanded = !credential.expanded;
};

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
        const bodyText = await body.text();

        // Intentar parsear el contenido como JSON
        let data;
        try {
            data = JSON.parse(bodyText);
        } catch (error) {
            console.error('Error al parsear el cuerpo de la respuesta JSON:', error);
        }

        // Verificar y almacenar los datos
        if (Array.isArray(data?.data)) {
            dataStore.userResponsible(data.data);
        } else {
            console.error('Datos de usuario responsables no válidos:', data);
        }
    } catch (error) {
        console.log('sin obtener datos', error);
    } finally {
    }
};
onMounted(() => {
    getResponsible();
})
</script>

<style scoped></style>