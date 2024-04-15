<template>
    <input v-model="userData[campo]" :type="tipo" />
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    userData: Object, // Objeto de datos del usuario
    campo: String, // Nombre del campo a mostrar en el input
    tipo: { type: String, default: 'text' } // Tipo del input (por defecto, 'text')
});
</script>
