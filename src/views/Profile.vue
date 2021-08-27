<template>
    <div class="flex h-screen w-24/25 justify-center items-center bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100">
        <div class="text-center">
            <div v-if="currentUser" class="flex flex-row items-center gap-x-4 text-left">
                <div class="">
                    <img class="w-16 h-16 rounded-full" :src="currentUser.userPhotoURL || require('@/assets/default-user-photo.jpg')" alt="User Photo" />
                </div>
                <div class="">
                    <span class="text-xl font-bold">
                        {{ currentUser.displayName }}
                    </span>
                    <br />
                    <code class="text-sm">
                        uid: {{ currentUser.uid }}
                    </code>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { auth } from "@/firebase.js";
import { ref, onMounted } from "vue";

export default {
    name: "Profile",
    components: {},
    setup() {
        const currentUser = ref({});

        onMounted(() => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // signed in
                    currentUser.value = user;
                } else {
                    // not signed in
                    currentUser.value = false;
                }
            });
        });

        return { currentUser };
    },
};
</script>
