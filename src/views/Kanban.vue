<template>
    <div class="flex flex-col items-center flex-auto w-full overflow-y-auto bg-gray-200 dark:bg-gray-700 dark:text-gray-200" id="#kanban" v-if="loggedIn" @click="dismissModal">
        <div class="flex flex-col md:flex-row items-center z-20">
            <div class="relative inline-block md:mr-4 text-left">
                <button @blur="closeDropdown" @click="toggleDropdown" type="button" class="mt-2 md:mt-0 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-transparent focus:ring-blue-600" id="options-menu" aria-haspopup="true" aria-expanded="true">
                    Projects
                    <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
                <transition enter-active-class="transition ease-out duration-100" enter-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div id="dropdownOptions" class="hidden origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white dark:bg-gray-700 border border-gray-400 ring-1 ring-black ring-opacity-5">
                        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <div @mousedown="yeet" class="cursor-pointer block px-4 py-2 text-sm text-left text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-gray-900" role="menuitem">chat</div>
                            <div @mousedown="yeet" class="cursor-pointer block px-4 py-2 text-sm text-left text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-100 hover:text-gray-900" role="menuitem">kanban</div>
                        </div>
                    </div>
                </transition>
            </div>

            <form class="flex flex-row w-lg mx-2 my-2 bg-gray-100 dark:bg-gray-800 rounded-xl" @submit.prevent="newItem">
                <input class="flex-auto py-2 pl-4 bg-gray-100 dark:bg-gray-800 placeholder-gray-600 dark:placeholder-gray-200 rounded-l-xl outline-none" v-model="itemText" placeholder="add a new task..." />
                <button class="flex-none px-8 bg-blue-500 disabled:opacity-50 rounded-r-xl" type="submit" :disabled="!itemText">📋</button>
            </form>
        </div>

        <div class="flex flex-col md:flex-row md:min-h-3/4 w-4/5 mb-4 space-x-0 space-y-2 md:space-x-2 md:space-y-0" id="board">
            <div class="flex-grow w-full md:w-1/3 p-4 min-h-3/4 rounded-xl shadow-md hover:shadow-xl z-10 bg-gray-300 dark:bg-gray-800" id="drop-todo" v-if="user" @drop="drop" v-on:dragover="allowDrop">
                <p class="font-semibold">To Do</p>
                <KanbanItem v-for="item in itemsTodo" :key="item.id" :item="item" @contextmenu.prevent="openContextMenu($event, item)"></KanbanItem>
            </div>

            <div class="flex-grow w-full md:w-1/3 p-4 min-h-3/4 rounded-xl shadow-md hover:shadow-xl z-10 bg-gray-300 dark:bg-gray-800" id="drop-inpr" v-if="user" @drop="drop" v-on:dragover="allowDrop">
                <p class="font-semibold">In Progress</p>
                <KanbanItem v-for="item in itemsInpr" :key="item.id" :item="item" @contextmenu.prevent="openContextMenu($event, item)"></KanbanItem>
            </div>

            <div class="flex-grow w-full md:w-1/3 p-4 min-h-3/4 rounded-xl shadow-md hover:shadow-xl z-10 bg-gray-300 dark:bg-gray-800" id="drop-done" v-if="user" @drop="drop" v-on:dragover="allowDrop">
                <div class="flex flex-row justify-between">
                    <p class="font-semibold">Done</p>
                    <button id="remove-all-done" @click="removeAll()">🗑️</button>
                </div>
                <KanbanItem v-for="item in itemsDone" :key="item.id" :item="item" @contextmenu.prevent="openContextMenu($event, item)"></KanbanItem>
            </div>
        </div>
    </div>

    <context-menu id="context-menu" :display="showContextMenu" ref="menu">
        <ul>
            <li class="py-1 px-2 rounded-t-md hover:bg-blue-500 hover:text-white" @click="deleteItemByMenu">Delete</li>
            <li class="py-1 px-2 rounded-b-md hover:bg-blue-500 hover:text-white" @click="displayModal">Add Tag</li>
        </ul>
    </context-menu>

    <SignInPrompt v-if="!loggedIn"></SignInPrompt>

    <Modal ref="modal">
        <template v-slot:body>
            <form @submit.prevent="newTag">
                <div class="bg-white dark:bg-gray-600 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <!-- Heroicon name: tag -->
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-blue-500 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center w-full sm:mt-0 sm:ml-4 sm:text-left">
                            <input id="newTagName" class="w-full mt-2 border-b dark:bg-gray-700 dark:text-gray-200 border-gray-400 focus:outline-none focus:ring focus:border-blue-400" v-model="tagText" placeholder="add a tag..." />
                        </div>
                    </div>
                </div>
                <div class="bg-gray-200 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button :disabled="!tagText" type="submit" class="disabled:opacity-50 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:ml-3 sm:w-auto sm:text-sm">
                        Add tag
                    </button>
                    <button @click="dismissModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 text-base font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </form>
        </template>
    </Modal>
</template>

<script>
import KanbanItem from "@/components/KanbanItem.vue";
import SignInPrompt from "@/components/SignInPrompt.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import Modal from "@/components/Modal.vue";
import { onMounted, ref } from "vue";
import { auth, db, addItem, modifyItemState, removeAllDone, removeItem, addTagToItem } from "@/firebase.js";
import $ from "jquery";

export default {
    name: "Kanban",
    components: {
        KanbanItem,
        ContextMenu,
        Modal,
        SignInPrompt,
    },
    setup() {
        const loggedIn = ref(false);
        const user = ref(undefined);
        const itemsTodo = ref([]);
        const itemsInpr = ref([]);
        const itemsDone = ref([]);
        const itemText = ref("");
        const showContextMenu = ref(false);

        async function newItem() {
            await addItem(itemText.value);
            itemText.value = "";
        }

        const drop = function(event) {
            event.preventDefault();
            try {
                var itemId = event.dataTransfer.getData("text/plain");
                var e = event.target;
                while (e.id != "body") {
                    if (e.id == "drop-todo") {
                        modifyItemState(itemId, "To Do");
                        e.appendChild(document.getElementById(itemId));
                        break;
                    } else if (e.id == "drop-inpr") {
                        modifyItemState(itemId, "In Progress");
                        e.appendChild(document.getElementById(itemId));
                        break;
                    } else if (e.id == "drop-done") {
                        modifyItemState(itemId, "Done");
                        e.appendChild(document.getElementById(itemId));
                        break;
                    } else {
                        e = e.parentNode;
                    }
                }
            } catch (e) {
                if (e.code == 1) console.log("Cannot drag multiple items at once."); // is this needed?
                if (e.code == 3) console.log("Cannot drop this item into its current list.");
                throw e;
            }
        };

        const allowDrop = function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
        };

        const removeAll = function() {
            removeAllDone();
        };

        auth.onAuthStateChanged((user) => {
            if (user) loggedIn.value = true;
            else loggedIn.value = false;
        });

        onMounted(() => {
            auth.onAuthStateChanged((a) => {
                if (a) {
                    // signed in
                    $("#kanban").show();
                    $("#sign-in-prompt").hide();
                    user.value = a;
                    db.collection("kanban-items")
                        .where("uid", "==", a.uid)
                        .orderBy("createdAt")
                        .onSnapshot((querySnapshot) => {
                            itemsTodo.value = [];
                            itemsInpr.value = [];
                            itemsDone.value = [];
                            querySnapshot.docs.forEach((doc) => {
                                if (doc.data().state == "To Do") itemsTodo.value.push(doc);
                                else if (doc.data().state == "In Progress") itemsInpr.value.push(doc);
                                else if (doc.data().state == "Done") itemsDone.value.push(doc);
                                else console.log("Did not find any matches for state " + doc.data().state);
                            });
                        });
                } else {
                    // not signed in
                    $("#kanban").hide();
                    $("#sign-in-prompt").show();
                    user.value = null;
                }
            });
        });

        return { loggedIn, user, itemsTodo, itemsInpr, itemsDone, itemText, showContextMenu, newItem, drop, allowDrop, removeAll };
    },
    data() {
        return {
            menuSelectedItem: Object,
            tagText: "",
        };
    },
    methods: {
        openContextMenu(e, item) {
            this.$refs.menu.open(e);
            this.menuSelectedItem = item;
        },
        deleteItemByMenu() {
            if (this.menuSelectedItem.id) {
                removeItem(this.menuSelectedItem.id);
            }
            this.$refs.menu.close();
        },
        addTagByMenu() {
            if (this.menuSelectedItem.id) {
                // add tag selection
            }
            this.$refs.menu.close();
        },
        dismissModal() {
            this.tagText = "";
            this.$refs.modal.close();
        },
        displayModal() {
            this.$refs.menu.close();
            this.$refs.modal.open();
            this.$nextTick(() => document.getElementById("newTagName").focus());
        },
        newTag() {
            if (this.menuSelectedItem.id && this.tagText) {
                addTagToItem(this.menuSelectedItem.id, this.tagText);
            }
            this.tagText = "";
            this.$refs.modal.close();
        },
        toggleDropdown() {
            $("#dropdownOptions").toggle();
        },
        closeDropdown() {
            this.$nextTick(() => $("#dropdownOptions").hide());
        },
        yeet() {
            console.log("yeet");
        },
    },
};
</script>
