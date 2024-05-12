<template>
    <div>
        <q-select
            v-model="selectedComponent"
            :options="['ScriptCard']"
            label="Select component"
            class="bg-white rounded-md"
        />
        <q-btn color="primary" label="Add" @click="addComponent" />

        <DbQueryCard @updateState="updateCardState(0, $event)" />

        <div v-for="(component, index) in components" :key="index" class="relative">
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
        const submit = () => {
            const steps = cardStates.value.map((state) => ({
                name: state.name,
                args: state.args,
            }));
            console.log(JSON.stringify({ steps }, null, 2));
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
