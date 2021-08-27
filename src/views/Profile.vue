<template>
    <div class="flex h-screen w-24/25 justify-center items-center bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100">
        <div class="flex flex-col gap-y-8 text-left p-8 rounded-xl shadow-md hover:shadow-xl z-10 bg-gray-300 dark:bg-gray-800">
            <div v-if="currentUser" class="flex flex-row items-center gap-x-4">
                <div class="">
                    <img class="w-16 h-16 rounded-full" :src="currentUser.userPhotoURL || require('@/assets/default-user-photo.jpg')" alt="User Photo" />
                </div>
                <div class="">
                    <span class="text-xl font-bold">
                        {{ currentUser.displayName }}
                    </span>
                    <br />
                    <code class="text-sm"> uid: {{ currentUser.uid }} </code>
                </div>
            </div>
            <div class="h-1 bg-gray-200 w-full"></div>
            <div class="ml-4">
                <input type="checkbox" id="darkmode-checkbox" v-model="darkmode" @change="doUpdateDarkmode" />
                <label for="darkmode-checkbox"> Lights {{ darkmode ? "Off 🌙" : "On ☀" }} </label>
            </div>
        </div>
    </div>
</template>

<script>
import { auth, db, updateDarkmode } from "@/firebase.js";
import { ref, onMounted, watch } from "vue";
import $ from "jquery";

export default {
    name: "Profile",
    components: {},
    setup() {
        const currentUser = ref({});
        const darkmode = ref(false);

        const doUpdateDarkmode = async function() {
            updateDarkmode(currentUser.value.uid, darkmode.value);
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

        return { currentUser, darkmode, doUpdateDarkmode };
    },
};
</script>
