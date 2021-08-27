<template>
    <div class="flex flex-row" :class="{ 'flex-row-reverse text-right': isSent() }">
        <img class="h-8 w-8 rounded-full my-1 mx-2" :src="message.data().photoURL || require('@/assets/default-user-photo.jpg')" alt="userPhoto" referrerpolicy="no-referrer" />
        <p class="flex flex-col clamp-max-w my-1 p-2 rounded-lg break-words" :class="{ 'bg-blue-500 text-white flex-row-reverse text-right': isSent(), 'bg-gray-100 text-black border border-gray-400': !isSent() }">
            <span class="font-semibold">{{ message.data().displayName }}</span>
            <span class="">{{ message.data().text }}</span>
        </p>
    </div>
</template>

<script>
export default {
    name: "ChatMessage",
    props: {
        message: Object,
        currentUser: Object,
    },
    setup(props) {
        const isSent = function() {
            return props.message.data().creatorUID == props.currentUser.uid;
        };

        return { isSent }
    },
};
</script>

<style scoped>
.clamp-max-w {
    max-width: min(65ch, 80%);
}
</style>
