<template>
    <div class="flex gap-2">
        <div class="flex items-center gap-2">
            <q-select
                class="bg-blue-200 rounded-md w-40"
                filled
                v-model="selectedCardType"
                :options="['ScriptCard']"
                label="Select Card Type"
            />
            <q-btn class="h-8 self-end" color="primary" label="Add" @click="addCard" />
        </div>
        <DbQueryCard @update-args="updateDbQueryArgs" />
        <div v-for="(card, index) in scriptCards" :key="card.id" class="relative">
            <component :is="card.type" :id="card.id" @remove="removeCard" @update-state="updateCardState" />
            <q-btn
                round
                color="primary"
                icon="arrow_upward"
                size="sm"
                :class="
                    index === 0 ? 'absolute top-10 right-0 opacity-40 cursor-not-allowed ' : 'absolute top-10 right-0'
                "
                @click="index !== 0 && moveUp(index)"
            />
            <q-btn
                round
                color="primary"
                icon="arrow_downward"
                size="sm"
                :class="
                    index === scriptCards.length - 1
                        ? 'absolute top-20 right-0 opacity-40 cursor-not-allowed'
                        : 'absolute top-20 right-0'
                "
                @click="index !== scriptCards.length - 1 && moveDown(index)"
            />
        </div>
        <SchedulerCard @update-cron="updateCron" />
        <q-btn color="primary" label="Submit" @click="submitPipeline" />
    </div>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
import DbQueryCard from "./Cards/DbQueryCard.vue";
import ScriptCard from "./Cards/ScriptCard.vue";
import SchedulerCard from "./Cards/SchedulerCard.vue";
import { createScheduledJob } from "src/services/schedulerServices";
import { DbResultsType } from "src/enums/DbResultsType";
import { ScriptResultsType } from "src/enums/ScriptResultsType";
import { ScriptType } from "src/enums/ScriptType";

export default {
    name: "SchedulerMaker",
    components: {
        DbQueryCard,
        ScriptCard,
        SchedulerCard,
    },
    setup() {
        const selectedCardType = ref<string>("ScriptCard");
        const scriptCards = ref<Array<{ id: number; type: string; state: any }>>([]);
        const cardCount = ref<number>(0);
        const dbQueryArgs = ref<any[]>([]);
        const cron = ref<string>("");

        const addCard = () => {
            scriptCards.value.push({
                id: cardCount.value++,
                type: selectedCardType.value,
                state: reactive({
                    uploadedFileName: "",
                    selectedScriptType: "r",
                    selectedDbResultsType: "json",
                    selectedScriptResultsType: "json",
                }),
            });
        };

        const removeCard = (id: number) => {
            const index = scriptCards.value.findIndex((card) => card.id === id);
            if (index !== -1) {
                scriptCards.value.splice(index, 1);
            }
        };

        const moveUp = (index: number) => {
            if (index > 0) {
                const temp = scriptCards.value[index];
                scriptCards.value[index] = scriptCards.value[index - 1];
                scriptCards.value[index - 1] = temp;
            }
        };

        const moveDown = (index: number) => {
            if (index < scriptCards.value.length - 1) {
                const temp = scriptCards.value[index];
                scriptCards.value[index] = scriptCards.value[index + 1];
                scriptCards.value[index + 1] = temp;
            }
        };

        const updateCardState = (id: number, newState: any) => {
            const card = scriptCards.value.find((card) => card.id === id);
            if (card) {
                card.state = { ...newState };
            }
        };

        const updateDbQueryArgs = (args: any[]) => {
            dbQueryArgs.value = args;
        };

        const updateCron = (newCron: string) => {
            cron.value = newCron;
        };

        const submitPipeline = async () => {
            const steps = [];

            // 1. Add DbQueryCard step
            steps.push({
                name: dbQueryArgs.value[0], // selectedOption from DbQueryCard
                args: dbQueryArgs.value.slice(1), // the rest of the arguments from DbQueryCard
            });

            // 2. Add ScriptCard steps
            scriptCards.value.forEach((card) => {
                steps.push({
                    name: "ExecuteRScript",
                    args: [
                        card.state.uploadedFileName,
                        ScriptType[card.state.selectedScriptType],
                        DbResultsType[card.state.selectedDbResultsType],
                        ScriptResultsType[card.state.selectedScriptResultsType],
                    ],
                });
            });

            try {
                const response = await createScheduledJob(steps, cron.value);
                console.log("Scheduled job response:", response);
            } catch (error) {
                console.error("Error submitting scheduled job:", error);
            }
        };

        return {
            selectedCardType,
            scriptCards,
            addCard,
            removeCard,
            updateCardState,
            updateDbQueryArgs,
            moveUp,
            moveDown,
            submitPipeline,
            dbQueryArgs,
            SchedulerCard,
            updateCron,
        };
    },
};
</script>
