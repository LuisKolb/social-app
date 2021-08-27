<template>
    <div class="flex flex-row w-full h-1/12 p-3 top-0 items-center sticky content-center font-semibold text-black bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-400">
        <button class="md:hidden mr-2" @click="$emit('goback')">
            <svg class="w-6 h-6 stroke-current text-gray-700 dark:text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>

        <img class="rounded-full w-8 h-8 mr-4" :src="getPhotoFromMap(content.selectedGroup) || require('@/assets/default-user-photo.jpg')" alt="target Photo" />
        <div class="font-semibold">
            {{ getNameFromMap(content.selectedGroup) }}
        </div>
    </div>
    <div class="min-h-10/12">
        <div v-for="message in content.messages" :key="message.id">
            <ChatMessage :message="message" :currentUser="content.currentUser"></ChatMessage>
        </div>
        <div id="scroll-target"></div>
    </div>
    <form class="flex flex-row w-full h-1/12 sticky bottom-0 bg-gray-100 border-t border-gray-300" @submit.prevent="doSendMessage">
        <input class="flex-auto p-4 bg-gray-100 dark:bg-gray-800 dark:text-white placeholder-gray-600 dark:placeholder-gray-200" v-model="content.inputText" placeholder="type your message here..." />
        <button class="flex-none px-8 bg-blue-500 disabled:opacity-50" type="submit" :disabled="!content.inputText">🕊️</button>
    </form>
</template>

<script>
import ChatMessage from "@/components/ChatMessage.vue";
import { onMounted, onUpdated, reactive, toRef, watch } from "vue";
import { db, sendMessage } from "@/firebase.js";
import $ from "jquery";

export default {
    name: "ChatWindow",
    emits: ["goback"],
    props: {
        currentUser: Object,
        selectedGroup: Object,
        users: Map,
    },
    components: {
        ChatMessage,
    },
    setup(props) {
        const content = reactive({
            inputText: "",
            messages: [],
            users: props.users,
            currentUser: props.currentUser,
            selectedGroup: props.selectedGroup,
        });

        const doSendMessage = async function() {
            await sendMessage(content.inputText, content.selectedGroup.id);
            content.inputText = "";
        };

        const getNameFromMap = function(group) {
            if (group.id == "global") {
                return group.name;
            }
            const friendUID = group.members.filter((uid) => uid != content.currentUser.uid)[0];
            if (content.users.has(friendUID)) {
                return content.users.get(friendUID).displayName;
            } else {
                return "loading...";
            }
        };

        const getPhotoFromMap = function(group) {
            if (group.id == "global") {
                return group.photoURL;
            }
            const friendUID = group.members.filter((uid) => uid != content.currentUser.uid)[0];
            if (content.users.has(friendUID)) {
                return content.users.get(friendUID).photoURL;
            } else {
                return false;
            }
        };

        const updateData = function() {
            (content.users = props.users), (content.currentUser = props.currentUser);
            content.selectedGroup = props.selectedGroup;
            setSnapshotListener();
            scrollDown();
        };

        const scrollDown = function() {
            if ($("#scroll-target").length > 0) $("#scroll-target")[0].scrollIntoView();
        };

        var currentMsgListener;
        const setSnapshotListener = function() {
            if (currentMsgListener) currentMsgListener();
            currentMsgListener = db
                .collection("messagecoll")
                .doc(content.selectedGroup.id)
                .collection("messages")
                .orderBy("createdAt", "desc")
                .limit(20)
                .onSnapshot((querySnapshot) => {
                    let tempArray = [];
                    querySnapshot.forEach((doc) => {
                        tempArray.push(doc);
                    });
                    tempArray = tempArray.reverse();
                    content.messages = tempArray;
                });
        };

        const selectedRef = toRef(props, "selectedGroup");
        watch(selectedRef, () => {
            updateData();
        });

        $(window).resize(function() {
            scrollDown();
        });

        onUpdated(() => {
            scrollDown();
        });

        onMounted(() => {
            updateData();
        });

        return { content, doSendMessage, getNameFromMap, getPhotoFromMap, }
    },
};
</script>
