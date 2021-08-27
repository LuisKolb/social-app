<template>
    <div class="flex flex-row h-screen md:h-screen w-full md:w-24/25 justify-center items-center bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100" v-if="content.loggedIn">
        <div id="friendslist" class="hover:text-opacity-100 md:flex flex-col flex-none h-screen w-full md:w-1/5 overflow-y-auto">
            <div class="p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-400 cursor-pointer" @click="openUserList">
                👋 new conversation
            </div>
            <div class="p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-400 cursor-pointer">
                <input class="w-full p-1" type="text" placeholder="search coming soon" disabled />
            </div>

            <div v-if="content.groups && users">
                <div v-for="group in content.groups" :key="group.id">
                    <div v-if="group.id == 'global'" class="flex flex-row items-center h-28 p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-400 cursor-pointer" :class="{ 'md:bg-blue-500': content.selectedGroup == group, 'md:dark:bg-blue-500': content.selectedGroup == group, 'md:text-white': content.selectedGroup == group }" @click="selectGroup(group)">
                        <img class="rounded-full w-12 h-12 mr-2" :src="require('@/assets/default-user-photo.jpg')" alt="userPhoto" referrerpolicy="no-referrer" />
                        <div class="flex flex-col w-3/4">
                            <span class="truncate font-semibold">
                                {{ group.name }}
                            </span>
                            <div class="flex flex-row items-center">
                                <svg class="w-4 h-4 inline stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span class="ml-2">{{ group.members.length }} Users</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="content.groups && users">
                <div v-for="group in content.groups" :key="group.id">
                    <div v-if="group.id != 'global'" class="flex flex-row items-center h-28 p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-400 cursor-pointer" :class="{ 'md:bg-blue-500': content.selectedGroup == group, 'md:dark:bg-blue-500': content.selectedGroup == group, 'md:text-white': content.selectedGroup == group }" @click="selectGroup(group)">
                        <img class="rounded-full w-12 h-12 mr-2" :src="getPhotoFromMap(group) || require('@/assets/default-user-photo.jpg')" alt="userPhoto" referrerpolicy="no-referrer" />
                        <div class="flex flex-col w-3/4">
                            <div class="truncate font-semibold">
                                {{ getNameFromMap(group) }}
                            </div>
                            <div class="flex flex-row items-center">
                                <div v-if="group.readBy && group.readBy.includes(group.members.filter((uid) => uid != content.currentUser.uid)[0])">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div v-else-if="group.recentMessage.text">
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="ml-1 truncate">{{ group.recentMessage.text }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="addFriend" class="hidden flex-none h-screen w-full md:w-1/5 overflow-y-auto" hidden>
            <NewGroup @closeusers="closeUserList"></NewGroup>
        </div>

        <div id="chatwindow" class="bg-opacity-50 h-screen w-full md:w-4/5 overflow-y-auto shadow-2xl bg-gray-200 dark:bg-gray-700" :style="getBgImage()">
            <div v-if="content.selectedGroup.id" class="h-screen w-full">
                <ChatWindow ref="chatWindow" @goback="openGroupList" :currentUser="content.currentUser" :selectedGroup="content.selectedGroup" :users="users"></ChatWindow>
            </div>
        </div>
    </div>

    <SignInPrompt v-if="!content.loggedIn"></SignInPrompt>
</template>

<script>
import ChatWindow from "@/components/ChatWindow.vue";
import NewGroup from "@/components/NewGroup.vue";
import SignInPrompt from "@/components/SignInPrompt.vue";
import { onMounted, reactive, toRef, watch } from "vue";
import { auth, db, getUser, readGroup } from "@/firebase.js";
import $ from "jquery";

export default {
    name: "Chat",
    components: {
        SignInPrompt,
        ChatWindow,
        NewGroup,
    },
    setup() {
        const content = reactive({
            loggedIn: false,
            currentUser: Object,
            selectedGroup: Object,
            groups: [],
            users: [],
        });

        const users = reactive(new Map());

        const getAssociatedUsers = async function() {
            for (const group of content.groups) {
                if (group.type == "private") {
                    const friendUID = group.members.filter((uid) => uid != content.currentUser.uid)[0];
                    var user = await getUser(friendUID);
                    if (!users.has(friendUID)) {
                        users.set(friendUID, user);
                    }
                }
            }
        };
        
        const getNameFromMap = function(group) {
            const friendUID = group.members.filter((uid) => uid != content.currentUser.uid)[0];
            if (users.has(friendUID)) {
                return users.get(friendUID).displayName;
            } else {
                return "loading...";
            }
        };

        const getPhotoFromMap = function(group) {
            const friendUID = group.members.filter((uid) => uid != content.currentUser.uid)[0];
            if (users.has(friendUID)) {
                return users.get(friendUID).photoURL;
            } else {
                return false;
            }
        };

        const groupsRef = toRef(content, "groups");
        watch(groupsRef, () => {
            getAssociatedUsers();
        });

        const getBgImage = function() {
            let ret = "url(" + require("@/assets/chat-pattern.png") + ")";
            if ($("#router-parent").has("dark")) {
                ret = "none";
            }
            return { backgroundImage: ret };
        };

        const selectGroup = async function(group) {
            content.selectedGroup = group;
            if ($(window).width() < 768) {
                $("#friendslist").hide();
            }

            $("#chatwindow").show();
            readGroup(group.id);
        };

        //const dataFromProxy = function(proxy) {
        //    return Object.assign({}, proxy);
        //};

        const openGroupList = function() {
            if ($("#friendslist").is(":hidden")) {
                $("#chatwindow").hide();
                $("#friendslist").show();
            }
        };

        const openUserList = function() {
            if ($("#friendslist").is(":visible")) {
                $("#friendslist").hide();
            }
            $("#addFriend").show();
        };

        const closeUserList = function() {
            $("#addFriend").hide();
            $("#friendslist").show();
        };

        $(window).resize(function() {
            if ($(window).width() >= 768) {
                $("#chatwindow").show();
                $("#friendslist").show();
            }
        });

        onMounted(async () => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    // signed in
                    content.loggedIn = true;
                    content.currentUser = user;
                    // load groups into array
                    db.collection("groups")
                        .where("members", "array-contains", content.currentUser.uid)
                        .onSnapshot((querySnapshot) => {
                            content.groups = [];
                            querySnapshot.forEach((doc) => {
                                content.groups.push(doc.data());
                            });
                        });
                    // select global?

                    // get all users
                    db.collection("users").onSnapshot((querySnapshot) => {
                        content.users = [];
                        querySnapshot.forEach((doc) => {
                            content.users.push(doc.data());
                        });
                    });
                } else {
                    // not signed in
                    content.loggedIn = false;
                    content.currentUser = null;
                }
            });
        });

        return { content, users, getNameFromMap, getPhotoFromMap, getBgImage, selectGroup, openGroupList, openUserList, closeUserList }
    },
};
</script>
