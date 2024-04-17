# Tabla de contenido
- [Tabla de contenido](#tabla-de-contenido)
- [Descripción](#descripción)
- [Configuración](#configuración)
    - [Vue 3 + TypeScript + Vite](#vue-3--typescript--vite)
- [Conexion con Lambdas](#conexion-con-lambdas)
- [Estructura del proyecto](#estructura-del-proyecto)
    - [components](#components)
      - [error](#error)
    - [router](#router)
    - [store](#store)
    - [types](#types)
    - [view](#view)
      - [adminView](#adminview)
      - [clientView](#clientview)
    - [helper](#helper)

# Descripción 
 Este proyecto se enfoca especialmente a la creacion y administracion de credenciales y usuarios de AWS, para el área de infraestructura, en ello se hizo el uso de Vue3 con typescript y vuetify.

 # Configuración
 ### Vue 3 + TypeScript + Vite
 Asegurarse de tener instalado Nodejs, para la inicialización del proyecto en vue con vite, se hace el uso de los siguientes comandos:
 ```powershell 
 # instalacion de vue con vite
 npm create vite@latest "nombre del proyecto"
 √ Select a framework: » Vue
 √ Select a variant: » TypeScript

Scaffolding project in C:\path
 
Done. Now run:
 
  cd "nombre del proyecto"

# instalar las dependencias
  npm install 

# inicializar el servidor
  npm run dev 
 ```

# Conexion con Lambdas
- Amplify
```powershell
# Antes e ejecutar los siguientes comandos, usted debe de tener una cuenta en AWS(Amazon Web Service)

# instalacion de amplify en el proyecto
npm install -g @aws-amplify/cli

#configuración
amplify configure
```

Para más información consulte el siguiente link 
[Amplify Dev Center](https://docs.amplify.aws/vue/start/getting-started/installation/)



# Estructura del proyecto

```
src
 ┣ 📂assets
 ┃ ┗ 📜vue.svg
 ┣ 📂components
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜error403.vue
 ┃ ┃ ┗ 📜error404.vue
 ┃ ┣ 📜editar.vue
 ┃ ┣ 📜globalBtn.vue
 ┃ ┣ 📜inputFilter.vue
 ┃ ┣ 📜inputGlobal.vue
 ┃ ┣ 📜Nav-bar.vue
 ┃ ┗ 📜tablegbl.vue
 ┣ 📂router
 ┃ ┗ 📜router.ts
 ┣ 📂store
 ┃ ┗ 📜datoUsuario.ts
 ┣ 📂types
 ┃ ┣ 📜env_json_update.ts
 ┃ ┗ 📜index.ts
 ┣ 📂view
 ┃ ┣ 📂adminView
 ┃ ┃ ┣ 📜AgrNewCred.vue
 ┃ ┃ ┣ 📜AgruserIAM.vue
 ┃ ┃ ┣ 📜credentialsTableAdmin.vue
 ┃ ┃ ┣ 📜responsible.vue
 ┃ ┃ ┣ 📜usuarios.vue
 ┃ ┃ ┗ 📜visualizeCredIAM.vue
 ┃ ┣ 📂clientView
 ┃ ┃ ┗ 📜credentialsClient.vue
 ┃ ┣ 📂helper
 ┃ ┃ ┣ 📜errors.ts
 ┃ ┃ ┣ 📜fieldValidate.ts
 ┃ ┃ ┗ 📜mensaje.ts
 ┃ ┗ 📜login.vue
 ┣ 📜ampliconfig.ts
 ┣ 📜App.vue
 ┣ 📜importFile.ts
 ┣ 📜main.ts
 ┣ 📜style.css
 ┗ 📜vite-env.d.ts
```

### components

`editar.vue`: Este archivo es un componente que tiene la funcionalidad de editar los datos de los usuarios locales.

`globalBtn.vue`: Es un componente reutilizable, es decir, que se esta utilizando en diferentes vistas, éste recibe diferentes tipos de datos por medio de props, los envia dependiendo de la función que se le asigne, vea la estructura del template: 
```typescript
<template>
    <button @click="handleClick, onClick" :class="buttonClass" class="btn_agr">
      {{ btn_global }}
    </button>
</template>

<script setup lang="ts">
import {props} from 'vue'
const props = defineProps({
    btn_global: String,
    stopEvent: {
        type: [Boolean, String],
        default: false,
    },
    buttonClass: String,
    onClikBtn: () => void [Number, Function]
});
</script>
```

`inputGlobal.vue`: Componente reutilizable que se utiliza en todos los furmularios que exista en este proyecto, recibe cualquier tipo de dato que se le envie por medio de los formularios, atraves de props, vea su estructura:
``` typescript
<template>
    <div>
        <v-responsive max-width="100%">
            <v-text-field @blur="handleBlur" :label="name" :type="type" :rules="[rules.required]" @input="listenInput">
                <label for="">{{ props.title }}</label>
            </v-text-field>
        </v-responsive>
    </div>
</template>

<script setup lang="ts">
import { defineProps} from 'vue'
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
</script>

```

`Nav-bar.vue`: Este componente se usa para la generación de la barra de navegación y esto se comporta como  un componente reutilizable, ya que se importa directamente desde el archivo App.vue:

```typescript
<template>
    <Nav-bar />
    <router-view />
</template>

<script lang="ts" setup>
import { NavBar } from './importFile';
</script>
```
`tablegbl.vue`: Esta es una tabla reutilizable, que se llama en cada componente que se requiera, recibe los datos directamente del store de pinia, por medio de datos computados, en ella se puede llamar los botones reutilizables, asi como sus funciones. Vea su estructura:

```typescript

<tablegbl :columns="columns" :data="dataTable" :showButtonEditar="true" :showButtonEliminar="true"
      @deleteUser="handleDeleteJSON" @editUser="handleEdit"/>

<script setup lang="ts">
import { tablegbl } from '../../importFile';

const columns = [
  { label: 'Id', key: 'id' },
  { label: 'Usuario', key: 'user' },
  { label: 'Correo', key: 'email' },
  { label: 'Rol', key: 'role' },
];

const dataTable = computed(() => dataStore.dataUsers);
</script>
```

#### error
`error404`: Es una platilla que se utiliza para mandar un error cuando el usuario va a una ruta que no existe.

`error403`:Es una plantilla que se utiliza cuando la ruta es privada dependiendo del rol del usuario. 


### router
`router.ts`: Este archivo nos ayuda a administrar las rutas de todos los componentes, asi como a protegerlos por medio de los guards, vea el ejemplo:

```typescript
const routes: RouteRecordRaw[] = [
{
    path: '/Home',
    name: 'home',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/usuarios.vue')
  }
]
```

### store
`datoUsuario.ts`: Este es el store de nuestro proyecto, que ayuda a almacenar los datos y poder pasarlos de un lugar a otro de una manera directa, el store esta fuera del nodo del DOM principal, esto hace que los datos no viajen de componente en componente. Vea el siguiente ejemplo:  

```typescript
// almacenamiento de datos
    whitOutCred: [{
            UserId: '',
            UserName: ''
        }],

//obtención de datos
   userEdit(saveDataEdit: UserId) {
            this.whitOutCred.push(saveDataEdit)
        },

```
### types
 `index.ts`: Archivo que contiene todas las interfaces, esto nos ayuda a generar la estructura de los datos que provienen de la endpoint, vea el ejemplo: 

 ```typescript
 export interface IdUsuario {
    id?: string,
    user?: string,
    email?: string,
    password?: string,
    role?: string,
};
 
 ``` 


### view
#### adminView
`AgrNewCred.vue`: Este componente nos ayuda a poder agregar nuevas credenciales y asignar esa credencial a un usuario.  

`AgruserIAM.vue`: Este componente no ayuda a agregar los usuarios IAM.

`credentialsTableAdmin.vue`: Tabla que contiene todas las credenciales creadas, su Id, su fecha de expiración, activo e inactivo, nombre de usuario IAM.

`responsible.vue`: Apartado en donde se podran visualizar los usuarios y las credenciales que se le asigno.

`usuarios.vue`: Podemos visualizar los usuario locales que han sido creados.

`visualizeCredIAM.vue`: En este componenet exiten funciones unicas para cada credencial, en donde se puede crear una segunda credencial, eliminarlas, rotarlas, activarlas, desactivarlas.


 
 #### clientView
 `credentialsClient.vue`: Vista única del usuario invitado, en donde puede visualizar las credenciales que se le asignaron, ver cuando expira cada una de ellas. 

 ### helper
 `errors.ts`: Contiene los mensajes que se le mostraran al usuari al momento de hacer ciertas acciones, como agregar usuarios, credenciaes, eliminar, etc. Y asi poder saber si la acción realizada fue con éxito o no.

`fieldValidate.ts`: Validación de campos, para que el usuario sepa que tipo de datos se reciben en formularios especificos, si los datos no son los esperados, manda un mensaje de error,  por ejemplo; al momento de agregar un nuevo usuario,. 

 `mensaje.ts`: Generador de alert, en donde se define si el mensaje va a ser de tipo `error` o `success` u otro.

 `login.vue`: Componente de logeo, valida el rol del usuario, tomando la información de la endpoint auth. 


 `ampliconfig.ts`: Conexión con las lambdas, definir region, y ruta de la endpoint.

 `importFile.ts` : Importación de todos los componentes a utilizar.

 `main.ts`: Importación de las librerias que se utilizaron en el proyecto. 