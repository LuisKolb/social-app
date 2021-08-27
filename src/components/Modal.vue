<template>
    <div v-show="isShown" class="fixed z-30 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <transition enter-active-class="ease-out duration-100" enter-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-class="opacity-100" leave-to-class="opacity-0">
                <div v-show="isShown" class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div @click="close" class="absolute inset-0 bg-gray-700 opacity-75"></div>
                </div>
            </transition>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <transition enter-active-class="ease-out duration-300" enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200" leave-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-show="isShown" class="inline-block align-bottom bg-white dark:bg-gray-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <slot name="body"> </slot>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: "Modal",
    data() {
        return {
            isShown: false,
        };
    },
    methods: {
        close() {
            this.isShown = false;
        },
        open() {
            this.isShown = true;
        },
    },
};
</script>
