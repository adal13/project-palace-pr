<template>
     <div class="not-found">
          <h1>404</h1>
          <p>Not Found!</p>
     </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.not-found {
     text-align: center;
     margin-top: 100px;
     font-size: 2rem;
}

.not-found h1 {
     font-size: 5rem;
     color: #f00;
     /* Color rojo para el número 404 */
}

.not-found p {
     margin-top: 20px;
}

.not-found router-link {
     display: inline-block;
     margin-top: 20px;
     text-decoration: underline;
     color: #007bff;
     /* Color azul para los enlaces */
}
</style>