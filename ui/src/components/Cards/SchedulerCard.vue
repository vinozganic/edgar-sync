<template>
    <div class="cron-quasar-wrapper flex w-full gap-5 bg-purple-700 rounded-md p-4 flex-wrap justify-stretch">
        <CronQuasar class="p-0" format="quartz" v-model="cron" @input="updateCron" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { CronQuasar } from "@vue-js-cron/quasar";
import "./SchedulerCard.css"

export default defineComponent({
    name: "SchedulerCard",
    emits: ["update-args"],
    setup(props, { emit }) {
        const cron = ref("");

        const updateCron = (event: Event) => {
            const value = (event.target as HTMLInputElement).value;
            cron.value = value;
            emit("update-args", value);
        };

        return {
            cron,
            updateCron,
            CronQuasar,
        };
    },
});
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
