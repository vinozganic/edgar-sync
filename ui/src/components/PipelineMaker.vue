<template>
    <div class="flex gap-2">
        <div class="flex gap-2 items-center">
            <q-select
                v-model="selectedComponent"
                :options="['ScriptCard']"
                label="Select component"
                class="bg-white rounded-md w-60"
            />
            <q-btn color="primary" label="Add" @click="addComponent" />
        </div>
        <DbQueryCard @updateState="updateCardState(0, $event)" />
        <div v-for="(component, index) in components" :key="index" class="w-full">
            <component :is="component" @updateState="updateCardState(index + 1, $event)" />
            <q-btn color="negative" label="X" class="absolute top-0 right-0" @click="removeComponent(index)" />
        </div>
        <q-btn color="primary" label="Submit" @click="submit" />
    </div>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import DbQueryCard from "./Cards/DbQueryCard.vue";
import ScriptCard from "./Cards/ScriptCard.vue";
import { setPipeline, uploadFile } from "src/services/pipelineServices";

export default {
    name: "PipelineMaker",
    components: {
        DbQueryCard,
        ScriptCard,
    },
    setup() {
        const selectedComponent: Ref<string> = ref("");
        const components: Ref<string[]> = ref([]);
        const scriptCardStates: Ref<any[]> = ref([]);

        const addComponent = () => {
            if (selectedComponent.value) {
                components.value.push(selectedComponent.value);
                scriptCardStates.value.push(null);
            }
        };

        const removeComponent = (index: number) => {
            components.value.splice(index, 1);
            scriptCardStates.value.splice(index, 1);
        };

        // State to keep track of the current configuration of each card
        const cardStates: Ref<any[]> = ref([]);

        // Function to update the state of a card
        const updateCardState = (index: number, state: any) => {
            cardStates.value[index] = state;
        };

        // Function to transform the card states into the desired format and log it to the console
        const submit = async () => {
            const steps = cardStates.value.map((state) => ({
                name: state.name,
                args: state.args,
            }));

            // Create a new Promise for each file upload
            const uploadPromises = steps.map(
                (step) =>
                    new Promise<void>(async (resolve, reject) => {
                        if (step.name === "ExecuteRScript") {
                            const fileName = step.args[0];
                            const base64File = step.args[1];
                            if (base64File) {
                                try {
                                    await uploadFile(base64File, fileName, step.args[2]);
                                    // Remove the base64 data from the object
                                    step.args = [fileName].concat(step.args.slice(2));
                                    resolve();
                                } catch (error) {
                                    console.error("File upload failed", error);
                                    reject(error);
                                }
                            } else {
                                resolve();
                            }
                        } else {
                            resolve();
                        }
                    })
            );

            // Wait for all the file uploads to finish
            await Promise.all(uploadPromises);

            console.log(JSON.stringify({ steps }, null, 2));
            await setPipeline(steps);
        };

        return {
            selectedComponent,
            components,
            addComponent,
            removeComponent,
            cardStates,
            updateCardState,
            submit,
        };
    },
};
</script>
