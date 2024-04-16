<template>
  <nav class="styleNav" v-if="$route.meta.showNavbar">
    <h1 class="text">The Palace Company</h1>
    <div class="aling">
      <div v-if="dataStore.role === 'ADMIN'">
        <router-link class=" styleLink" to="/Home">Usuarios</router-link>
      </div>
      <div v-if="dataStore.role === 'ADMIN'">
        <router-link class="styleLink" to="/Credentials">Credenciales</router-link>
      </div>
      <div v-if="dataStore.role === 'ADMIN'">
        <router-link class="styleLink" to="/Responsible">Responsables</router-link>
      </div>
      <globalBtn btn_global="Cerrar sesion" buttonClass="alingBtn" @click="logout" />
    </div>
  </nav>

</template>

<script lang="ts" setup>
import { globalBtn } from '../importFile';
import router from '../router/router';
import { usedataStore } from '../store/datoUsuario';
const dataStore = usedataStore()

const logout = () => {
  dataStore.logout()
  router.push("/")
}
</script>

<style scoped>
body {
  height: 100%;
}

.text {
  background-image: url("../../public/img/images.jpg");
  background-size: cover;
  background-clip: text;
  -webkit-background-clip: text;
  display: flex;
  color: transparent;
  margin-left: 10px;
  text-transform: uppercase;
  font-size: 27px;
  letter-spacing: 2px;

}

div {
  font-family: 'verdana';
  display: inline;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.15em;
}


.aling {
  margin-left: 25%;
  align-content: center;
  align-items: center;
  text-align: center;

}

.alingBtn {
  background-color: #f8f9fa;
  box-shadow: 0 0 10px rgba(230, 225, 225, 0.5);
  color: #333;
  font-size: 13px;
  cursor: pointer;
  border-radius: 10px;
  height: 30px;
  width: 130px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s, box-shadow 0.3s;


}

.alingBtn:hover {
  background-color: #333;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  color: #fff;
}

.styleNav {
  background-color: #145474;
  display: flex;
  align-items: center;
  align-content: flex-end;
  padding: 10px;
}

.styleLink {
  text-decoration: none;
  color: white;
  padding: 15px;

}

.styleLink:hover {
  color: #333;
}
</style>