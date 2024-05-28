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
        <DbQueryCard :jobProps="dbQueryCardProps" @update-args="updateDbQueryArgs" />
        <div v-for="(card, index) in scriptCards" :key="card.id" class="relative">
            <component
                :jobProps="scriptCardProps"
                :is="card.type"
                :id="card.id"
                @remove="removeCard"
                @update-state="updateCardState"
            />
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
        <!-- {{ job }} -->
    </div>
</template>

<script lang="ts">
import { ref, reactive, watch } from "vue";
import DbQueryCard from "./Cards/DbQueryCard.vue";
import ScriptCard from "./Cards/ScriptCard.vue";
import SchedulerCard from "./Cards/SchedulerCard.vue";
import { DbResultsType } from "src/enums/DbResultsType";
import { ScriptResultsType } from "src/enums/ScriptResultsType";
import { ScriptType } from "src/enums/ScriptType";
import { Job } from "../interfaces/interfaces";

export default {
    name: "SchedulerMaker",
    components: {
        DbQueryCard,
        ScriptCard,
        SchedulerCard,
    },
    props: {
        job: {
            type: Object as () => Job,
            required: true,
        },
    },
    setup(props, { emit }) {
        const selectedCardType = ref<string>("ScriptCard");
        const scriptCards = ref<Array<{ id: number; type: string; state: any }>>([]);
        const cardCount = ref<number>(0);
        const dbQueryArgs = ref<any[]>([]);
        const cron = ref<string>("");
        const dbQueryCardProps = ref<any>({});
        const scriptCardProps = ref<any>([]);

        const clearCards = () => {
            scriptCards.value = [];
            cardCount.value = 0;
            scriptCardProps.value = [];
        };

        const addExistingCard = (card: any) => {
            scriptCards.value.push({
                id: cardCount.value++,
                type: "ScriptCard",
                state: {
                    uploadedFileName: card.args[0],
                    selectedScriptType: ScriptType[card.args[1] as number],
                    selectedDbResultsType: DbResultsType[card.args[2] as number],
                    selectedScriptResultsType: ScriptResultsType[card.args[3] as number],
                },
            });
            scriptCardProps.value.push({
                jobProps: {
                    uploadedFileName: card.args[0],
                    selectedScriptType: ScriptType[card.args[1] as number],
                    selectedDbResultsType: DbResultsType[card.args[2] as number],
                    selectedScriptResultsType: ScriptResultsType[card.args[3] as number],
                },
            });
            emitScriptCardSteps();
        };

        const addNewCard = () => {
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
            emitScriptCardSteps();
        };

        const removeCard = (id: number) => {
            const index = scriptCards.value.findIndex((card) => card.id === id);
            if (index !== -1) {
                scriptCards.value.splice(index, 1);
                emitScriptCardSteps();
            }
        };

        const moveUp = (index: number) => {
            if (index > 0) {
                const temp = scriptCards.value[index];
                scriptCards.value[index] = scriptCards.value[index - 1];
                scriptCards.value[index - 1] = temp;
                emitScriptCardSteps();
            }
        };

        const moveDown = (index: number) => {
            if (index < scriptCards.value.length - 1) {
                const temp = scriptCards.value[index];
                scriptCards.value[index] = scriptCards.value[index + 1];
                scriptCards.value[index + 1] = temp;
                emitScriptCardSteps();
            }
        };

        const emitScriptCardSteps = () => {
            const steps = scriptCards.value.map((card) => ({
                name: "ExecuteRScript",
                args: [
                    card.state.uploadedFileName,
                    ScriptType[card.state.selectedScriptType],
                    DbResultsType[card.state.selectedDbResultsType],
                    ScriptResultsType[card.state.selectedScriptResultsType],
                ],
            }));
            emit("update-script-steps", steps);
        };

        const updateCardState = (id: number, newState: any) => {
            const card = scriptCards.value.find((card) => card.id === id);
            if (card) {
                card.state = { ...newState };
                emitScriptCardSteps(); // Emitiranje promjena nakon ažuriranja stanja
            }
        };

        const updateCron = (newCron: string) => {
            cron.value = newCron;
            emit("update-cron", newCron);
        };

        // Azuriranje argumenata za DbQueryCard
        const updateDbQueryArgs = (args: any[]) => {
            dbQueryArgs.value = args;
            emit("update-db-query-step", args);
        };

        watch(
            () => props.job,
            (newJob) => {
                if (newJob && newJob.steps && newJob.steps.length > 0) {
                    const firstStep = newJob.steps[0];
                    if (firstStep && firstStep.name && firstStep.args) {
                        dbQueryCardProps.value = {
                            name: firstStep.name,
                            args: firstStep.args,
                        };
                    }
                    if (newJob.steps.length > 1) {
                        clearCards();
                        const scriptSteps = newJob.steps.slice(1);
                        scriptSteps.map((step) => {
                            addExistingCard(step);
                        });
                    }
                }
            },
            { immediate: true }
        );

        return {
            selectedCardType,
            scriptCards,
            addCard: addNewCard,
            removeCard,
            updateCardState,
            updateDbQueryArgs,
            moveUp,
            moveDown,
            dbQueryArgs,
            SchedulerCard,
            updateCron,
            dbQueryCardProps,
            scriptCardProps,
        };
    },
};
</script>
