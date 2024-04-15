// import { ref } from "vue";
// import { errorMessages } from "./errors";

// const mensajeCredUserIAMs = ref("");
// const mostrarMensajeCredUserIAMs = ref<boolean>(false);

// const mostrarMensajeTempralCredUserIAMs = (errorKey: keyof typeof errorMessages) => {
//      // Mostrar el mensaje de error correspondiente
//      mensajeCredUserIAMs.value = errorMessages[errorKey];
//      mostrarMensajeCredUserIAMs.value = true;

//      // Ocultar el mensaje después de cierto tiempo
//      setTimeout(() => {
//           mostrarMensajeCredUserIAMs.value = false;
//      }, 6000); // Ocultar el mensaje después de 6 segundos (6000 milisegundos)
// };

// export default mostrarMensajeTempralCredUserIAMs
// export { mensajeCredUserIAMs, mostrarMensajeCredUserIAMs };


import { ref } from "vue";
import { errorMessages } from "./errors";

const mensajeCredUserIAMs = ref("");
const mostrarMensajeCredUserIAMs = ref<boolean>(false);

const tipoDeAlerta = ref<"success" | "error" | "warning" | "info" | undefined>("success");

// const tipoDeAlerta = ref("success");  // Nuevo estado para manejar el tipo de alerta

const mostrarMensajeTempralCredUserIAMs = (errorKey: keyof typeof errorMessages, tipo: 'success' | 'error' | 'warning' = 'success') => {
     mensajeCredUserIAMs.value = errorMessages[errorKey];
     mostrarMensajeCredUserIAMs.value = true;
     tipoDeAlerta.value = tipo;  // Asignar el tipo de alerta basado en el parámetro

     setTimeout(() => {
          mostrarMensajeCredUserIAMs.value = false;
     }, 2000);
};

export default mostrarMensajeTempralCredUserIAMs
export { mensajeCredUserIAMs, mostrarMensajeCredUserIAMs, tipoDeAlerta };

