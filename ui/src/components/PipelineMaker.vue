<template>
    <div class="flex gap-2 rounded-lg bg-white p-[16px]">
        <div class="flex items-center gap-2 w-full relative">
            <q-select
                class="bg-blue-100 rounded-md w-40"
                filled
                v-model="selectedCardType"
                :options="['ScriptCard']"
                label="Select Card Type"
            />
            <q-btn class="h-8 self-end" color="primary" label="Add" @click="addCard" />
            <q-btn
                round
                size="11px"
                class="text-lg text-center text-white bg-red-600 absolute right-0 bottom-0"
                icon="priority_high"
                @click="openDialog"
            />
        </div>
        <DbQueryCard @update-args="updateDbQueryArgs" />
        <div v-for="(card, index) in scriptCards" :key="card.id" class="w-full relative">
            <component :is="card.type" :id="card.id" @remove="removeCard" @update-state="updateCardState" />
            <q-btn
                round
                color="primary"
                icon="arrow_upward"
                size="xs"
                :class="
                    index === 0
                        ? 'absolute top-[1.9rem] right-0 opacity-40 cursor-not-allowed'
                        : 'absolute top-[1.9rem] right-0'
                "
                @click="index !== 0 && moveUp(index)"
            />
            <q-btn
                round
                color="primary"
                icon="arrow_downward"
                size="xs"
                :class="
                    index === scriptCards.length - 1
                        ? 'absolute top-[3.7rem] right-0 opacity-40 cursor-not-allowed'
                        : 'absolute top-[3.7rem] right-0'
                "
                @click="index !== scriptCards.length - 1 && moveDown(index)"
            />
        </div>
        <q-btn color="primary" label="Submit" @click="submitPipeline" />
        <q-dialog v-model="confirmDialog">
            <q-card class="bg-red-50">
                <q-card-section class="row items-center text-[15px] flex flex-col gap-2 h-full">
                    <div>
                        <q-icon name="warning" color="red" class="text-xl mb-1" />
                        <span class="q-ml-sm">
                            Make sure to <b>upload</b> all scripts before submitting the pipeline/job!</span
                        >
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Close" color="red-600" class="font-bold" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
import DbQueryCard from "./Cards/DbQueryCard.vue";
import ScriptCard from "./Cards/ScriptCard.vue";
import { executePipeline } from "src/services/pipelineServices";
import { DbResultsType } from "src/enums/DbResultsType";
import { ScriptResultsType } from "src/enums/ScriptResultsType";
import { ScriptType } from "src/enums/ScriptType";

export default {
    name: "PipelineMaker",
    components: {
        DbQueryCard,
        ScriptCard,
    },
    setup() {
        const selectedCardType = ref<string>("ScriptCard");
        const scriptCards = ref<Array<{ id: number; type: string; state: any }>>([]);
        const cardCount = ref<number>(0);
        const dbQueryArgs = ref<any[]>([]);
        const confirmDialog = ref<boolean>(false);

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
                // console.log("Pipeline steps:", JSON.stringify(steps, null, 2));
                const response = await executePipeline(steps);
                console.log("Pipeline response:", response);
            } catch (error) {
                console.error("Error submitting pipeline:", error);
            }
        };

        const openDialog = () => {
            confirmDialog.value = true;
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
            confirmDialog,
            openDialog,
        };
    },
};
</script>
