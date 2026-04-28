// router/routes.js

import HomePage from '../pages/HomePage.vue'
import EventDetailsPage from '../pages/EventDetailsPage.vue'
import GuestProfilePage from '../pages/GuestProfilePage.vue'
import SearchPage from '../pages/SearchPage.vue'
import authGuard from "./authGuard";
import store from "src/store/index.js";
import UserProfilePage from '../pages/UserProfilePage.vue'
import CreateEventPage from '../pages/CreateEventPage.vue'


const redirectIfEmpresa = (to, from, next) => {
  if (store.state.user && store.state.user.scope === "empresa") {
    next("/s");
    next();
  } else if (store.state.user && store.state.user.scope === "entregador") {
    next("/show-packs");
  } else if (store.state.user && store.state.user.scope === "admin") {
    next("/admin");
  } else {
    next();
  }
};

const routes = [

  { path: '/', component: HomePage, name: 'home' },
  { path: '/event/:id', component: EventDetailsPage, name: 'event-details' },
  { path: '/guest/:id', component: GuestProfilePage, name: 'guest-profile' },
  { path: '/search', component: SearchPage, name: 'search' },
  // Adicionar rotas:
  { path: '/profile', component: UserProfilePage, name: 'profile' },
  { path: '/create-event', component: CreateEventPage, name: 'create-event' },
  { path: '/edit-event/:id', component: CreateEventPage, name: 'edit-event' },

  ,
  // Rota de empresas lojas
  {
    path: "/s",
    component: () => import("layouts/MainLayout.vue"),
    children: [

      {
        path: "store",
        component: () => import("pages/admin/ManageStore.vue"),
        meta: { requiredScopes: ["admin"] },
      },

    ],
    beforeEnter: authGuard,
  },

  // Rota admin
  {
    path: "/admin",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "store/:id",
        component: () => import("pages/admin/StoreProfilePage.vue"),
        meta: { requiredScopes: ["admin"] },
      },
    ],
    beforeEnter: authGuard,
  },

  // Rotas privadas
  {
    path: "/",
    // component: () => import("layouts/SotoreLayout.vue"),
    children: [
      // rotas do Cliente
      {
        path: "pack/:id",
        props: true,
        name: "PackagePage2",
        component: () => import("pages/package/PackagePage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
      {
        path: "packs",
        props: true,
        name: "ListPackagePage",
        component: () => import("pages/package/ListPackagePage.vue"),
        meta: { requiredScopes: ["cliente"] },
      },
    ],
    beforeEnter: authGuard, // Aplica o guarda de autenticação para rotas privadas
  },

  // Rotas publicas
  {
    path: "/",
    // component: () => import("layouts/SotoreLayout.vue"),
    children: [
      // rotas do Cliente

      {
        path: "privacy-policy",
        component: () => import("pages/politicas/PrivacyPolicy.vue"),

      },
      {
        path: "sobre",
        component: () => import("pages/politicas/AboutUs.vue"),

      },
    ],
    // beforeEnter: authGuard,
  },

  {
    path: "/login",
    component: () => import("pages/auth/LoginPage.vue"),
    meta: { requiresAuth: false },
    beforeEnter: authGuard, // Aplica o guarda de autenticação para a página de login
  },
  {
    path: "/register",
    component: () => import("pages/auth/RegisterPage.vue"),
    meta: { requiresAuth: false },
    beforeEnter: authGuard, // Aplica o guarda de autenticação para a página de registro
  },

  // Rota para página não encontrada
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];


export default routes;
