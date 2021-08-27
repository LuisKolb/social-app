<template>
    <div class=" z-50 bg-blue-500 text-white m-1 rounded-md cursor-pointer" :id="item.id" draggable="true" @dragstart="dragStart" @drag="dragging">
        <div class="p-1">
            {{ item.data().text }}
        </div>
        <div class="flex flex-row-reverse p-1" v-if="item.data().tags && item.data().tags.length > 0">
            <div class="px-1 text-xs rounded-lg bg-red-400 border border-gray-400" v-for="tag in item.data().tags" :key="tag">
                {{ tag }}
                <div class="inline font-bold" @click="deleteTag(tag)">x</div>
            </div>
        </div>
    </div>
</template>

<script>
import { removeTagFromItem } from "@/firebase.js";

export default {
    name: "KanbanItem",
    props: {
        item: Object,
    },
    setup(props) {
        const dragStart = function(event) {
            event.dataTransfer.setData("text/plain", event.target.id);
        };
        const dragging = function() {};

        const removeItem = function(id) {
            removeItem(id);
        };

        const deleteTag = function(tag) {
            console.log(tag);
            removeTagFromItem(props.item.id, tag);
        };

        return { dragStart, dragging, removeItem, deleteTag }
    },
};
</script>
