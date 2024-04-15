import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import routes from './router/router';
// import VueCookies from 'vue-cookies-ts'
import './style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
  components,
  directives,
});

// sweetAlert 
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


createApp(App)
  .use(createPinia())
  // .use(VueCookies)
  .use(routes)
  .use(vuetify)
  .use(VueSweetalert2)
  .mount('#app');

