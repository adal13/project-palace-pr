# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.


## tree
📦src
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
 ┃ ┃ ┣ 📜addNewUser.vue
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