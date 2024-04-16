<template>
    <button @click="handleClick, onClick" :class="buttonClass" class="btn_agr">{{ btn_global }}</button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    btn_global: String,
    stopEvent: {
        type: [Boolean, String],
        default: false,
    },
    buttonClass: String,
    onClikBtn: () => void [Number, Function]
});

const handleClick = () => {
    props.onClikBtn;
};
const emit = defineEmits()

emit('cambiar nombre', 'nuevo nombre del boton')
const onClick = () => {
    if (props.stopEvent) {
        console.log('eventonclick');
    } else {
        console.log('eventonclick no');
    }
};

</script>

<style>
.btn_agr {
    align-content: center;
    color: #333;
    border-radius: 5px;
    margin: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 8px;
    padding-bottom: 8px;


}
</style>