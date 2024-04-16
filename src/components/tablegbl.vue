<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">{{ column.label }}</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedData" :key="index">
          <td v-for="(column, columnIndex) in columns" :key="columnIndex">{{ item[column.key] }}</td>
          <td>

            <globalBtn buttonClass="BtnEditar" v-if="showButtonEditar" btn_global="Editar"
              @Click="handleButtonEdit(item.id)" />
            <globalBtn buttonClass="BtnEliminar" v-if="showButtonEliminar" btn_global="Eliminar"
              @click="handleButtonDelete(item.id)" />

            <!-- Botones de usuario IAM  -->
            <globalBtn buttonClass="BtnEliminar" v-if="showButtonEliminarIAM" btn_global="Eliminar"
              @click="handleButtonDeleteIAM(item.UserName)" />
            <globalBtn buttonClass="BtnVisualizar" v-if="showButtonVisualize" btn_global="Visualizar"
              @click="handleButtonVisualize(item.UserName)" />

          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="6">
            <div class="pagination_container">
              <div class="items-per-page">
                <label class="text-style-size" for="itemsPerPageSelect">Items por página:</label>
                <select class="text-style-size" id="itemsPerPageSelect" v-model="itemsPerPage"
                  @change="handleItemsPerPageChange">
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="15">15</option>
                  <option :value="20">20</option>
                </select>

                <v-pagination v-model="currentPage" :total-visible="5" :per-page="itemsPerPage"
                  @change="handlePagination" :length="totalPages" />
                <div class="text-style-size">{{ itemsInfo }}</div>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';
// import { VPagination } from 'vuetify/lib/components/index.mjs';
import { globalBtn } from '../importFile';
import router from '../router/router';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'




const emit = defineEmits()
const props = defineProps({
  showButtonEditar: Boolean,
  showButtonEliminar: Boolean,
  showButtonVisualize: Boolean,
  showButtonEliminarIAM: Boolean,
  showButtonVisualizeUser: Boolean,
  botonLabel: {
    type: String,
    required: false
  },
  columns: Array as () => { label: string, key: string }[],
  data: Array as () => Record<string, any>[] | undefined,
  NameBtn: Array as () => { name: string, class: string; }[],
});
props



// Función para manejar el clic en el botón de editar
const handleButtonEdit = (id: string | number) => {
  emit('editUser', id);
  console.log(`Usuario con ID ${id} editado`);

  if (id) {
    router.push({
      name: 'editar',
      params: {
        id: id,
      }
    })
    console.log('id', id)

  } else {
    console.error('Usuario no encontrado');
  }
};


// Función para manejar el clic en el botón de eliminar
const handleButtonDelete = (Idusers: string | number) => {

  Swal.fire({
    text: "¿Está seguro de eliminar al usuario?",
    position: "center",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
  }).then((result) => { // Usa el método `then` para manejar la respuesta del usuario
    if (result.isConfirmed) { // Si el usuario confirma la acción
      emit('deleteUser', Idusers);
      console.log(`Usuario con ID ${Idusers} eliminado`);
    }
  });
};


// Función para manejar el clic en el botón de visualizar, hay que checar si se crearia varios del mismo, se utilizaria varias

const handleButtonVisualize = (UserName: string | number) => {
  emit('visualizeCredUser', UserName);
  console.log(`Usuario con ID ${UserName} visualizado`);
  if (UserName) {
    router.push({
      name: 'visualizeCredIAM',
      params: {
        UserName: UserName,
      }
    })

  } else {
    console.error('Usuario no encontrado');
  }

};

const handleButtonDeleteIAM = (UserName: string | number) => {
  Swal.fire({
    text: `¿Está seguro de eliminar al usuario  ${UserName}?`,
    position: "center",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
  }).then((result) => { // Usa el método `then` para manejar la respuesta del usuario
    if (result.isConfirmed) { // Si el usuario confirma la acción
      emit('deleteIAM', UserName);

      console.log(`Usuario  ${UserName} Eliminado`);
    }
  });
};

const currentPage = ref(1);
const itemsPerPage = ref(5);

const totalItems = computed(() => props.data?.length ?? 0);

const startIndex = computed(() => Math.min((currentPage.value - 1) * itemsPerPage.value + 1, totalItems.value));
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value));

const paginatedData = computed(() => props.data?.slice(startIndex.value - 1, startIndex.value + itemsPerPage.value - 1));
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

const itemsInfo = computed(() => `${startIndex.value}-${endIndex.value} de ${totalItems.value}`);

const handleItemsPerPageChange = () => {
  currentPage.value = 1;
};

const handlePagination = (value: number) => {
  currentPage.value = value;
};

watch(itemsPerPage, () => {
  currentPage.value = 1;
}, { immediate: true });

</script>

<style>
table {
  background-color: white;
  box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.2);

}

table:hover {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.9);
}

.table {
  text-transform: none;
  width: 90%;
  border-collapse: collapse;
  font-family: Arial;
  margin-top: 1%;
  margin-bottom: 5%;
  margin-left: 5%;
  margin-right: 5%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: left;
}

.BtnEditar {
  width: auto;
  height: auto;
  background-color: hsl(105, 96%, 79%,
      0.9);
}

.BtnEliminar {
  width: auto;
  height: auto;
  background-color: hsl(354, 82%, 60%, 0.9);
}

.BtnVisualizar {
  width: auto;
  height: auto;
  background-color: hsl(214, 67%, 72%, 0.9);
}

tfoot {
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  padding: 20px;
  text-align: center;
}

.items-per-page {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

#itemsPerPageSelect {
  margin-left: 10px;
}

.pagination-container {
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.items-per-page select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 20%;
}

.text-style-size {
  font-size: 15px;
  text-transform: none;
}
</style>