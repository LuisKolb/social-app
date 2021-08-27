<template>
    <div class="flex h-screen w-24/25 justify-center items-start md:items-center bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100">
        <div class="flex flex-col gap-y-8 text-center p-8 mt-8 md:mt-0 mx-4 rounded-xl shadow-md hover:shadow-xl z-10 bg-gray-300 dark:bg-gray-800">
            <div v-if="currentUser" class="flex flex-col md:flex-row items-center gap-x-4 text-left">
                <div class="mb-4 md:mb-0">
                    <img class="w-16 h-16 rounded-full" :src="currentUser.userPhotoURL || require('@/assets/default-user-photo.jpg')" alt="User Photo" />
                </div>
                <div class="">
                    <span class="text-xl font-bold">
                        {{ currentUser.displayName }}
                    </span>
                    <br />
                    <code class="text-sm overflow-ellipsis"> uid: {{ currentUser.uid }} </code>
                </div>
            </div>
            <div class="">
                <button id="darkmode-button" @click="doToggleDarkmode" class="p-2 w-full rounded-md border-2 border-gray-200 bg-gray-200 dark:bg-gray-700 dark:border-gray-700 shadow-sm">Lights {{ darkmode ? "Off 🌙" : "On ☀" }}</button>
            </div>
            <div class="">
                <button id="logout-button" @click="signOut" class="p-2 w-full rounded-md border-2 border-red-600 text-red-600">Sign Out</button>
            </div>
        </div>
    </div>
</template>

<script>
import { auth, db, updateDarkmode, signOut } from "@/firebase.js";
import { ref, onMounted, watch } from "vue";
import $ from "jquery";

export default {
    name: "Profile",
    components: {},
    setup() {
        const currentUser = ref({});
        const darkmode = ref(false);

        const doToggleDarkmode = async function() {
            updateDarkmode(currentUser.value.uid, !darkmode.value);
        };

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
                            darkmode.value = doc.data().darkmode;
                        });
                } else {
                    // not signed in
                    currentUser.value = false;
                }
            });
        });

        return { currentUser, darkmode, doToggleDarkmode, signOut };
    },
};
</script>
