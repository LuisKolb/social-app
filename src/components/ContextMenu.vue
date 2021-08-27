<template>
    <div class="context-menu fixed outline-none cursor-pointer z-50 bg-gray-100 border border-gray-400 rounded-md" v-show="show" :style="style" tabindex="0" @blur="close">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "ContextMenu",
    props: {
        display: Boolean, // prop detect if we should show context menu
    },
    data() {
        return {
            left: 0, // left position
            top: 0, // top position
            show: false, // affect display of context menu
        };
    },
    computed: {
        // get position of context menu
        style() {
            return {
                top: this.top + "px",
                left: this.left + "px",
            };
        },
    },
    methods: {
        // closes context menu
        close() {
            this.show = false;
            this.left = 0;
            this.top = 0;
        },
        open(evt) {
            // updates position of context menu
            this.left = evt.pageX || evt.clientX;
            this.top = evt.pageY || evt.clientY;
            // make element focused
            // @ts-ignore
            this.$nextTick(() => this.$el.focus());
            this.show = true;
        },
    },
};
</script>
