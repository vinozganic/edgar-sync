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
        <q-chip v-if="uploadedFile">
            {{ uploadedFile.name }}
        </q-chip>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

export default defineComponent({
    setup() {
        const uploadedFile = ref<File | null>(null);

        const handleFileUpload = (file: File) => {
            uploadedFile.value = file;
            // TODO: Upload the file to the server
        };

        return {
            uploadedFile,
            handleFileUpload,
        };
    },
});
</script>
