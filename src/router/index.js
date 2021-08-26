import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    },
    {
        path: "/about",
        name: "About",
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
    },
    {
        path: "/oracle",
        name: "Oracle",
        component: () => import(/* webpackChunkName: "oracle" */ "../views/Oracle.vue"),
    },
    {
        path: "/preferences",
        name: "Preferences",
        component: () => import(/* webpackChunkName: "preferences" */ "../views/Preferences.vue"),
    },
    {   path: "/:pathMatch(.*)", 
        name: "NotFound", 
        component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"), 
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
