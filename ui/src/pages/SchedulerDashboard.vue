<template>
    <div class="flex min-h-[87vh] flex-row gap-[4%] rounded-lg bg-gray-100 px-16 py-8 flex-nowrap shadow-2xl">
        <div class="flex w-full flex-col flex-nowrap gap-4">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-gray-800">Scheduler Dashboard</h1>
            </div>
            <SchedulerMaker />
        </div>
    </div>
</template>

<script setup lang="ts">
import "vue-json-pretty/lib/styles.css";
import SchedulerMaker from "src/components/SchedulerMaker.vue";
</script>
