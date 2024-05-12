<template>
    <div>
        <q-select
            v-model="selectedComponent"
            :options="['ScriptCard']"
            label="Select component"
            class="bg-white rounded-md"
        />
        <q-btn color="primary" label="Add" @click="addComponent" />

        <DbQueryCard />

        <div v-for="(component, index) in components" :key="index" class="relative">
            <component :is="component" />
            <q-btn color="negative" label="X" class="absolute top-0 right-0" @click="removeComponent(index)" />
        </div>
        <q-btn color="primary" label="Submit" />
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, Ref } from "vue";
import DbQueryCard from "./Cards/DbQueryCard.vue";
import ScriptCard from "./Cards/ScriptCard.vue";

export default defineComponent({
    name: "PipelineMaker",
    components: {
        DbQueryCard,
        ScriptCard,
    },
    setup() {
        const selectedComponent: Ref<string> = ref("");
        const components: Ref<string[]> = ref([]);
        const dbQueryCardState = ref(null);
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

        return {
            selectedComponent,
            components,
            addComponent,
            removeComponent,
        };
    },
});
</script>
