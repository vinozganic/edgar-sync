<template>
    <div class="flex h-full flex-row gap-[4%] rounded-lg bg-gray-100 px-16 py-8 flex-nowrap shadow-2xl">
        <div class="flex w-full flex-col flex-nowrap gap-2">
            <!-- <DbQueryCard />
            <ScriptCard /> -->
            <PipelineMaker />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getStudentsOnCourse, getStudentsTestResults } from "src/services/pgServices";
import "vue-json-pretty/lib/styles.css";
import { useErrorHelper } from "../composables/useErrorHelper";
import DbQueryCard from "src/components/Cards/DbQueryCard.vue";
import ScriptCard from "src/components/Cards/ScriptCard.vue";
import PipelineMaker from "src/components/PipelineMaker.vue";
</script>
