<template>
    <div class="flex w-full bg-blue-700 rounded-md p-4 items-center gap-5">
        <q-file
            v-model="uploadedFile"
            filled
            label="Upload .R or .Rmd file"
            accept=".R, .Rmd"
            @update:modelValue="handleFileUpload"
            class="bg-white rounded-md w-52"
        >
            <template v-slot:prepend>
                <q-icon name="cloud_upload" />
            </template>
        </q-file>
        <q-select
            filled
            v-model="selectedScriptType"
            :options="['r', 'rmd']"
            label="Select Script Type"
            class="bg-white rounded-md w-40"
        />
        <q-select
            filled
            v-model="selectedDbResultsType"
            :options="['json', 'csv']"
            label="Select DB Results Type"
            class="bg-white rounded-md w-40"
        />
        <q-select
            filled
            v-model="selectedScriptResultsType"
            :options="['json', 'csv', 'html']"
            label="Select Script Results Type"
            class="bg-white rounded-md w-40"
        />
    </div>
</template>

<script lang="ts">
import { ref, watch, Ref } from "vue";
import { DbResultsType } from "src/enums/DbResultsType";
import { ScriptResultsType } from "src/enums/ScriptResultsType";
import { ScriptType } from "src/enums/ScriptType";

export default {
    setup(props, { emit }) {
        const uploadedFile = ref<File | null>(null);
        const base64File = ref<string | null>(null);

        const handleFileUpload = (file: File) => {
            uploadedFile.value = file;
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const base64String = btoa(new TextDecoder().decode(new Uint8Array(arrayBuffer)));
                base64File.value = base64String;
            };
            reader.readAsArrayBuffer(file);
        };

        const selectedScriptType: Ref<keyof typeof ScriptType> = ref("r");
        const selectedDbResultsType: Ref<keyof typeof DbResultsType> = ref("json");
        const selectedScriptResultsType: Ref<keyof typeof ScriptResultsType> = ref("json");

        const emitState = () => {
            const state = {
                name: "ExecuteRScript",
                args: [
                    uploadedFile.value ? uploadedFile.value.name : "",
                    base64File.value || "",
                    ScriptType[selectedScriptType.value],
                    DbResultsType[selectedDbResultsType.value],
                    ScriptResultsType[selectedScriptResultsType.value],
                ],
            };
            emit("updateState", state);
        };

        watch(
            () => [
                uploadedFile.value,
                base64File.value,
                selectedScriptType.value,
                selectedDbResultsType.value,
                selectedScriptResultsType.value,
            ],
            emitState,
            { immediate: true }
        );

        return {
            uploadedFile,
            handleFileUpload,
            selectedScriptType,
            selectedDbResultsType,
            selectedScriptResultsType,
            ScriptType,
            DbResultsType,
            ScriptResultsType,
        };
    },
};
</script>
