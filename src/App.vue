<template>
    <div id="router-parent" class="flex flex-col md:flex-row">
        <div id="navbar-spacer-left" class="hidden md:block w-1/25 min-w-48px h-screen"></div>
        <div id="navbar-spacer-bottom" class="md:hidden w-full h-12 absolute bottom-0"></div>
        <Navbar></Navbar>
        <router-view />
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { auth, db } from "@/firebase.js";
import { ref, onMounted, watch } from "vue";
import $ from "jquery";

export default {
    name: "App",
    components: {
        Navbar,
    },
    setup() {
        const currentUser = ref({});
        const darkmode = ref(false);

        watch(darkmode, () => {
            if (darkmode.value) {
                $("#router-parent").addClass("dark");
            } else {
                $("#router-parent").removeClass("dark");
            }
        });

        onMounted(() => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // signed in
                    currentUser.value = user;
                    db.collection("users")
                        .doc(currentUser.value.uid)
                        .onSnapshot((doc) => {
                            darkmode.value = doc.data()?.darkmode;
                        });
                } else {
                    // not signed in
                    currentUser.value = false;
                    darkmode.value = false;
                }
            });
        });

        return { currentUser, darkmode };
    },
};
</script>
