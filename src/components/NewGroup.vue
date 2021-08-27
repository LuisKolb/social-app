<template>
    <div class="flex flex-col w-full h-screen ">
        <div class="flex flex-row my-2 mr-2 items-center">
            <button class="mx-2" @click="$emit('closeusers')">
                <svg class="w-6 h-6 stroke-current text-gray-700 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <input class="p-2 w-full h-full bg-gray-100 dark:bg-gray-800 placeholder-gray-600 dark:placeholder-white" placeholder="add a friend..." />
        </div>

        <div v-for="u in users" :key="u.id">
            <div v-if="u.data().displayName" @click="doNewPrivateChat(u.id)" class="p-2 cursor-pointer break-words dark:text-gray-200">
                <img class="rounded-full w-6 h-6 mr-2 inline" :src="(u.data().photoURL != '' && u.data().photoURL) || require('@/assets/default-user-photo.jpg')" alt="userPhoto" referrerpolicy="no-referrer" />

                {{ u.data().displayName }}
            </div>
        </div>
    </div>
</template>

<script>
import { db, auth, newPrivateChat, joinGlobalChat } from "@/firebase.js";
import { onMounted, ref } from "vue";

export default {
    name: "NewGroup",
    emits: ["closeusers"],
    setup() {
        const users = ref([]);
        const currentUser = ref({});

        const doNewPrivateChat = async function(targetUID) {
            if (targetUID == "global") {
                console.log(await joinGlobalChat(currentUser.value));
            } else {
                console.log(await newPrivateChat(currentUser.value, targetUID));
            }
        };

        onMounted(() => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    currentUser.value = user;
                    db.collection("users").onSnapshot((querySnapshot) => {
                        users.value = [];
                        querySnapshot.forEach(function(doc) {
                            users.value.push(doc);
                        });
                    });
                }
            });
        });

        return { users, currentUser, doNewPrivateChat }
    },
};
</script>
