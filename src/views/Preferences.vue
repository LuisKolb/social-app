<template>
    <div class="flex h-screen w-24/25 justify-center items-center bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100">
        <div class="text-center">
            <!-- TODO: update on page visit -->
            <input type="checkbox" id="darkmode-checkbox" v-model="darkmode" @change="doUpdateDarkmode" />
            <label for="darkmode-checkbox"> Lights {{ darkmode ? "Off 🌙" : "On ☀" }} </label>
        </div>
    </div>
</template>

<script>
import { auth, db, updateDarkmode } from "@/firebase.js";
import { ref, onMounted, watch } from "vue";
import $ from "jquery";

export default {
    name: "Preferences",
    setup() {
        // TODO: update how this works lol
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
        return { currentUser, darkmode, doUpdateDarkmode }
    },
};
</script>
