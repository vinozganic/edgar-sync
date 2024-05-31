<template>
    <div class="cron-quasar-wrapper flex w-full gap-5 bg-purple-700 rounded-md p-4 flex-wrap">
        <CronQuasar ref="cronComponent" class="p-0" v-model="cron" @update:model-value="updateCron" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { CronQuasar } from "@vue-js-cron/quasar";
import "../../css/SchedulerCard.css";

export default defineComponent({
    name: "SchedulerCard",
    emits: ["update-cron"],
    props: {
        jobProps: Object,
    },
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

        // Watch cron ref to update CronQuasar component
        watch(cron, (newCron) => {
            cronComponent.value.cron = newCron;
        });

        watch(
            () => props.jobProps as any,
            (newProps: any) => {
                cron.value = newProps.cron;
            }
        );

        const cronComponent = ref<any>(null);

        return {
            cron,
            updateCron,
            cronComponent,
            CronQuasar,
        };
    },
});
</script>
