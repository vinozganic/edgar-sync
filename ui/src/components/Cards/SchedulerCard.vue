<template>
    <div class="cron-quasar-wrapper flex w-full gap-5 bg-purple-700 rounded-md p-4 flex-wrap justify-stretch">
        <CronQuasar class="p-0" v-model="cron" @update:model-value="updateCron" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { CronQuasar } from "@vue-js-cron/quasar";
import "./SchedulerCard.css";

export default defineComponent({
    name: "SchedulerCard",
    emits: ["update-cron"],
    setup(props, { emit }) {
        const cron = ref("* * * * *");

        // Emit cron value on mount
        onMounted(() => {
            emit("update-cron", cron.value);
        });

        const updateCron = (newCron: string) => {
            cron.value = newCron;
            emit("update-cron", newCron);
        };

        return {
            cron,
            updateCron,
            CronQuasar,
        };
    },
});
</script>
