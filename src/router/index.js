import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/main"),
    children: [
      {
        path: "/",
        name: "dashboard",
        component: () => import("../views/productos.vue"),
      },
      {
        path: "/citas",
        name: "citas",
        component: () => import("../views/citas.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/register"),
  },
  {
    path: "/forbidden",
    name: "Forbidden",
    component: () => import("../views/forbidden"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (!["login", "register"].includes(to.name)) {
    const token = localStorage.getItem("token");
    if (!token) {
      next("/login");
      return;
    }
  }
  next();
  return;
});

export default router;
