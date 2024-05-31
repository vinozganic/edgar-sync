<template>
    <div class="flex min-h-[87vh] flex-row gap-[4%] rounded-lg bg-gray-100 px-16 py-8 flex-nowrap shadow-2xl">
        <div class="flex w-full flex-col flex-nowrap gap-4">
            <div class="text-center text-primary">
                <h1 class="text-3xl font-bold">Pipeline Dashboard</h1>
            </div>
            <PipelineMaker />
        </div>
    </div>
</template>

<script setup lang="ts">
import "vue-json-pretty/lib/styles.css";
import PipelineMaker from "src/components/PipelineMaker.vue";
</script>
