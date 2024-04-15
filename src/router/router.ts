import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import login from '../view/login.vue'
// import { createPinia } from 'pinia';
import { usedataStore } from '../store/datoUsuario';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: login,
    meta: { showNavbar: false },
  },
  {
    path: '/Home',
    name: 'home',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/home.vue'),
  },
  {
    path: '/users',
    name: 'usuarios',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/usuarios.vue')
  },
  {
    path: '/credentials',
    name: 'credentialsTableAdmin',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },

    component: () => import('../view/adminView/credentialsTableAdmin.vue'),
  },
  {
    path: '/responsible',
    name: 'responsible',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },

    component: () => import('../view/adminView/responsible.vue'),
  },
  {
    path: '/edit/:id',
    name: 'editar',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../components/editar.vue'),
    props: true
  },
  {
    path: '/user/:id',
    name: 'user',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/usuarios.vue'),
    props: true
  },
  {
    path: '/agregar',
    name: 'addNewUser',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/addNewUser.vue'),
  },
  {
    path: '/AgrNewCred',
    name: 'AgrNewCred',
    meta: { requiresAdmin: true, requiresAuth: true, showNavbar: true, role: 'ADMIN' },
    component: () => import('../view/adminView/AgrNewCred.vue'),
  },
  {
    path: '/VisualizeIAM/:UserName',
    name: 'visualizeCredIAM',
    meta: { requiresAdmin: true },
    component: () => import('../view/adminView/visualizeCredIAM.vue'),
    props: true
  },
  {
    path: '/clientView',
    name: 'client',
    meta: { requiresUser: true, requiresAuth: true, showNavbar: true, role: 'INVITADO' },
    component: () => import('../view/clientView/credentialsClient.vue')
  },
  {
    path: '/:catchAll(.*)',
    // meta: { showNavbar: false },
    component: () => import('../components/error/error404.vue')
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('../components/error/error403.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {

  const dataStore = usedataStore();
  const isLoggedInValue = dataStore.isLoggedIn;
  const isRole = dataStore.role
  // console.log("Valor de la variable en router.ts", isLoggedInValue)
  // console.log("Valor de la variable en role", isRole)

  type RolePaths = {
    ADMIN: string;
    INVITADO: string;
  };
  const roleRedirect = {
    'ADMIN': '/Home',
    'INVITADO': '/clientView',
  };

  // Verificar si la ruta actual es la de Login
  if (to.path === '/' && isLoggedInValue) {
    // Redirige al usuario a su página de inicio basada en el rol
    const redirectPath = roleRedirect[isRole as keyof RolePaths] || '/';
    return next({ path: redirectPath });
  }

  // Verificar si la ruta requiere autenticación y el usuario no está logueado
  if (to.meta.requiresAuth && !isLoggedInValue) {
    // Redirige al usuario a la página de login
    return next({ path: '/forbidden' });
  }

  // Para rutas que requieren un rol específico
  if (to.meta.role && to.meta.role !== isRole && isLoggedInValue) {
    // Redirige al usuario a una página de "Acceso Denegado" o similar
    return next({ path: '/forbidden' });
  }

  next();

});

export default router;




