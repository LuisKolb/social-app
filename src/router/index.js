import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    },
    {
        path: "/chat",
        name: "Chat",
        component: () => import(/* webpackChunkName: "chat" */ "../views/Chat.vue"),
    },
    {
        path: "/oracle",
        name: "Oracle",
        component: () => import(/* webpackChunkName: "oracle" */ "../views/Oracle.vue"),
    },
    {
        path: "/kanban",
        name: "Kanban",
        component: () => import(/* webpackChunkName: "kanban" */ "../views/Kanban.vue"),
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
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
