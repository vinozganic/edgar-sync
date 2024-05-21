<template>
    <div class="flex w-full bg-blue-700 rounded-md p-4 items-center gap-5">
        <div class="bg-white rounded-md w-52 p-2">
            <input
                :id="'file-input-' + id"
                type="file"
                accept=".R, .Rmd"
                @change="onFileChange"
                class="w-full"
                ref="fileInput"
            />
        </div>
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
        <q-btn :disabled="!isBase64Ready" color="primary" label="Upload" @click="handleFileUpload" />
        <q-btn color="negative" icon="close" size="sm" class="absolute top-0 right-0 w-8" @click="removeCard" />
    </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent, onMounted } from "vue";
import { DbResultsType } from "src/enums/DbResultsType";
import { ScriptResultsType } from "src/enums/ScriptResultsType";
import { ScriptType } from "src/enums/ScriptType";
import { uploadFile } from "src/services/pipelineServices";
import { getFileNameWithTimestamp } from "app/helpers/getFileNameWithTimestamp";

export default {
    name: "ScriptCard",
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    emits: ["remove", "update-state"],
    setup(props, { emit }) {
        const selectedScriptType = ref<keyof typeof ScriptType>("r");
        const selectedDbResultsType = ref<keyof typeof DbResultsType>("json");
        const selectedScriptResultsType = ref<keyof typeof ScriptResultsType>("json");

        const isFileUploaded = ref(false);
        const uploadedFileName = ref("");
        const uploadedFile = ref<File | null>(null);
        const base64File = ref<string>("");
        const isBase64Ready = ref(false);
        const fileInput = ref<HTMLInputElement | null>(null);

        const toBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve((reader.result as string).split(",")[1]);
                reader.onerror = reject;
            });
        };

        const onFileChange = async (event: Event) => {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                await updateUploadedFile(file);
            }
        };

        const updateUploadedFile = async (file: File) => {
            uploadedFile.value = file;
            isFileUploaded.value = !!file;
            isBase64Ready.value = false;

            const fileNameWithTimestamp = getFileNameWithTimestamp(file.name);
            uploadedFileName.value = fileNameWithTimestamp;

            try {
                base64File.value = await toBase64(file);
                isBase64Ready.value = true;
                emitStateUpdate(); // Ensure state is updated after base64 is ready
            } catch (error) {
                console.error("Error converting file to base64:", error);
                isBase64Ready.value = false;
            }
        };

        const handleFileUpload = () => {
            if (!uploadedFile.value || !base64File.value) return;
            uploadFile(base64File.value, uploadedFileName.value, ScriptType[selectedScriptType.value]);
        };

        const removeCard = () => {
            emit("remove", props.id);
        };

        const emitStateUpdate = () => {
            emit("update-state", props.id, {
                uploadedFileName: uploadedFileName.value,
                selectedScriptType: selectedScriptType.value,
                selectedDbResultsType: selectedDbResultsType.value,
                selectedScriptResultsType: selectedScriptResultsType.value,
                base64File: base64File.value,
            });
        };

        // Page load
        onMounted(() => {
            emitStateUpdate();
        });

        watch(
            [uploadedFileName, selectedScriptType, selectedDbResultsType, selectedScriptResultsType, base64File],
            emitStateUpdate
        );

        return {
            selectedScriptType,
            selectedDbResultsType,
            selectedScriptResultsType,
            updateUploadedFile,
            handleFileUpload,
            isFileUploaded,
            uploadedFile,
            removeCard,
            isBase64Ready,
            onFileChange,
            fileInput,
        };
    },
};
</script>
