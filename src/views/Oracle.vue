<template>
    <div class="flex h-screen md:h-screen w-full md:w-24/25 justify-center items-center bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100">
        <div class="text-center">
            <div id="question">
                "O great Oracle, I beseech thee, hath the time for consumption of amazing ales arrived?"
            </div>
            <div id="answer">The Oracle answers</div>
        </div>
    </div>
</template>

<script>
import { onMounted } from "vue";
import $ from "jquery";

export default {
    setup() {
        const sleep = async function(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        };

        onMounted(async () => {
            let today = new Date();
            let aw = "The Oracle answers";

            $("#answer").text(aw);
            for (let i = 0; i < 3; i++) {
                await sleep(500);
                aw += ".";
                $("#answer").text(aw);
            }

            await sleep(800);

            if (today.getHours() >= 16 || today.getHours() <= 4) {
                aw += " Absolutely.";
            } else {
                aw += " Not quite yet.";
            }
            $("#answer").text(aw);
        });
    },
};
</script>
