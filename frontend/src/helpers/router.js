import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores";
import {
  HomeView,
  LoginView,
  ProductView,
  UsersView,
  SignUpView,
  ForgotView,
  ResetPassword,
} from "@/views";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    { path: "/", component: HomeView },
    { path: "/signin", component: LoginView },
    { path: "/signup", component: SignUpView },
    { path: "/forget", component: ForgotView },
    { path: "/reset-password", component: ResetPassword },

    {
      path: "/users",
      component: UsersView,
      props: true,
    },
    {
      path: "/products",
      component: ProductView,
      props: true,
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

const publicPages = ["/signin", "/signup", "/forget", "/reset-password"];

router.beforeEach((to, from, next) => {
  const auth = useAuthStore(); // Assuming you have a Vuex store for authentication

  if (publicPages.includes(to.path) && auth.user) {
    // If user is logged in, prevent access to login, signup, forget, reset-password pages
    return next("/");
  }

  if (!publicPages.includes(to.path) && !auth.user) {
    // If user is not logged in, redirect to login page
    auth.returnUrl = to.fullPath;
    return next("/signin");
  }

  next(); // Continue with the navigation
});
