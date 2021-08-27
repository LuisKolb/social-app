<template>
    <div class="flex flex-col justify-between w-1/25 min-w-48px h-screen fixed bg-gray-300 dark:bg-gray-900 text-gray-700 dark:text-gray-200 overflow-y-auto overflow-x-hidden">
        <div class="flex flex-col">
            <router-link class="p-3 w-full h-full flex flex-col items-center" to="/">
                <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </router-link>
            <router-link class="p-3 w-full h-full flex flex-col items-center" to="/chat">
                <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </router-link>
            <router-link class="p-3 w-full h-full flex flex-col items-center" to="/kanban">
                <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
            </router-link>
            <router-link class="p-3 w-full h-full flex flex-col items-center" to="/oracle">
                <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </router-link>
        </div>
        <div class="flex flex-col">
            <!--
            <router-link class="p-3 text-xs w-full h-full flex flex-col items-center" to="/preferences" v-if="loggedIn">
                <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            </router-link>
            -->
            <router-link class="p-3 text-xs w-full h-full flex flex-col items-center" to="/profile" v-if="loggedIn">
                <img class="w-6 h-6 rounded-full" :src="userPhotoURL || require('@/assets/default-user-photo.jpg')" v-if="loggedIn" alt="User Photo" />
            </router-link>
            <a class="p-3 text-xs w-full h-full flex flex-col items-center" @click="doSignInWithGoogle" v-if="!loggedIn">
                <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </a>
            <a class="p-3 text-xs w-full h-full flex flex-col items-center" @click="doSignOut" v-if="loggedIn">
                <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            </a>
        </div>
    </div>
</template>

<script>
import { auth, signInWithGoogle, signOut } from "@/firebase.js";
import { ref } from "vue";

export default {
    name: "Navbar",
    setup() {
        const doSignInWithGoogle = () => signInWithGoogle();
        const doSignOut = () => signOut();
        const loggedIn = ref(false);
        const userPhotoURL = ref("");

        auth.onAuthStateChanged((user) => {
            if (user) {
                loggedIn.value = true;
                userPhotoURL.value = user.photoURL;
            } else loggedIn.value = false;
        });

        return { doSignInWithGoogle, doSignOut, loggedIn, userPhotoURL }
    },
};
</script>

<style scoped>
a.router-link-exact-active {
    background-color: rgba(0, 0, 0, 0.1);
}

a.router-link-exact-active svg {
    color: rgba(29, 78, 216, var(--tw-text-opacity));
}
</style>
