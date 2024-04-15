<template>
  <nav class="styleNav" v-if="$route.meta.showNavbar">
    <h1 class="text">The Palace Company</h1>
    <div class="aling">
      <div v-if="dataStore.role === 'ADMIN'">
        <router-link class=" styleLink" to="/Users">Users</router-link>
      </div>
      <div v-if="dataStore.role === 'ADMIN'">
        <router-link class="styleLink" to="/Credentials">Credentials</router-link>
      </div>
      <div>
        <router-link class="styleLink" to="/Responsible">Responsible</router-link>
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

<style>
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
  margin-left: 40px;

}

div {
  font-family: 'verdana';
  display: inline;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.15em;
  /* position: relative; */
}

/* 
div:hover:after {
  width: 100%;
  left: 0;
  background-color: aqua;
} */

.aling {
  margin-left: 30%;
}

.alingBtn {
  /* padding: 10px 20px; */
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
  /* height: 80px; */
  /* padding-top: 26px; */
  /* padding-left: 100px; */
  /* font-weight: bold; */
  /* display: flex; */
  /* gap: 60px; */
}

.styleLink {
  /* text-decoration: none; */
  /* list-style: none; */
  /* font-size: 18px; */
  /* font-weight: 700; */
  text-decoration: none;
  /* text-transform: uppercase; */
  color: white;
  padding: 15px;
  /* transition: 0.4s ease; */
  /* color: white;
  font-weight: bold;
  margin-top: 10px;
  margin: 20px; */

}

/* .styleLink:hover {
  color: #6C6B6C;
  /* background: #6C6B6C; */
.styleLink:hover {
  color: #333;
}
</style>