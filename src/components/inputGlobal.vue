<template>
    <div>
        <v-responsive max-width="100%">
            <v-text-field @blur="handleBlur" :label="name" :type="type" :rules="[rules.required]" variant="outlined"
                v-model="inputValue" @input="listenInput" :class="classInput" single-line>
                <label for="">{{ props.title }}</label>
            </v-text-field>
        </v-responsive>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, defineEmits, watch } from 'vue'
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: [String, Number],
        required: false,
    },
    name: String,
    type: String,
    classInput: String,
    pattern: {
        type: RegExp,
        default: null
    },
    handleBlur: Function
})

const inputValue = ref(props.value)
const emit = defineEmits();
emit('update:value', inputValue.value)


const listenInput = (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value

    inputValue.value = newValue
    emit('update:value', newValue)

}

watch(
    () => props.value,
    (newValue) => {
        inputValue.value = newValue
    }
)

const rules = {
    required: (value: string) => !!value || 'campo requerido'
}

</script>

<style scoped></style>