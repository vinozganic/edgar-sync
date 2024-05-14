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
        <div v-for="card in scriptCards" :key="card.id" class="relative">
            <component :is="card.type" :id="card.id" @remove="removeCard" @update-state="updateCardState" />
        </div>
        <q-btn color="primary" label="Submit" @click="submitPipeline" />
    </div>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
import DbQueryCard from "./Cards/DbQueryCard.vue";
import ScriptCard from "./Cards/ScriptCard.vue";
import { setPipeline } from "src/services/pipelineServices";
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
                console.log("Pipeline steps:", JSON.stringify(steps, null, 2)); // UNCOMMENT FOR DEBUGGING !!!
                // const response = await setPipeline(steps);
                // console.log("Pipeline response:", response);
            } catch (error) {
                console.error("Error submitting pipeline:", error);
            }
        };

        return {
            selectedCardType,
            scriptCards,
            addCard,
            removeCard,
            updateCardState,
            updateDbQueryArgs,
            submitPipeline,
            dbQueryArgs,
        };
    },
};
</script>
