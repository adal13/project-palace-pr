<template>
     <div class="forbidden">
          <h1>403</h1>
          <p>Forbidden!</p>
          <router-link to="/">Inicie Sesión</router-link>
     </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.forbidden {
     text-align: center;
     margin-top: 100px;
     font-size: 2rem;
}

.forbidden h1 {
     font-size: 5rem;
     color: #f00;
     /* Color rojo para el número 403 */
}

.forbidden p {
     margin-top: 20px;
}

.forbidden router-link {
     display: inline-block;
     margin-top: 20px;
     text-decoration: underline;
     color: #007bff;
     /* Color azul para los enlaces */
}
</style>