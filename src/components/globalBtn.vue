<template>
    <!-- <btn class="btn_glo_component" @click="onClick"> -->
    <button @click="handleClick, onClick" :class="buttonClass" class="btn_agr">{{ btn_global }}</button>
    <!-- </btn> -->
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

// const handleClick = ref <HTMLFormElement | null>(null)
const handleClick = () => {
    props.onClikBtn;
};
const emit = defineEmits()
// console.log(handleClick)

emit('cambiar nombre', 'nuevo nombre del boton')
const onClick = () => {
    if (props.stopEvent) {
        console.log('eventonclick');
        // handleClick.value?.login
    } else {
        console.log('eventonclick no');
        // myform.value?.submit();
    }
};

</script>

<style>
.btn_agr {
    align-content: center;
    color: #333;
    /* border: 2px solid #333; */
    border-radius: 5px;
    margin: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 8px;
    padding-bottom: 8px;


}
</style>