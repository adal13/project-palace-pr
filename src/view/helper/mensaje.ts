import { ref } from "vue";
import { errorMessages } from "../helper/errors";

const mensajeCredUserIAMs = ref("");
const mostrarMensajeCredUserIAMs = ref<boolean>(false);

const tipoDeAlerta = ref<"success" | "error" | "warning" | "info" | undefined>("success");

const mostrarMensajeTempralCredUserIAMs = (errorKey: keyof typeof errorMessages, tipo: 'success' | 'error' | 'warning' = 'success') => {
     mensajeCredUserIAMs.value = errorMessages[errorKey];
     mostrarMensajeCredUserIAMs.value = true;
     tipoDeAlerta.value = tipo;  

     setTimeout(() => {
          mostrarMensajeCredUserIAMs.value = false;
     }, 2000);
};

export default mostrarMensajeTempralCredUserIAMs
export { mensajeCredUserIAMs, mostrarMensajeCredUserIAMs, tipoDeAlerta };

