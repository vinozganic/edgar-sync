<template>
    <div class="flex w-full gap-5 bg-green-700 rounded-md p-4 flex-wrap justify-stretch">
        <div class="">
            <q-select
                filled
                v-model="selectedOption"
                :options="dropdownOptions"
                label="Select query"
                class="bg-white rounded-md"
            />
        </div>
        <div class="flex flex-wrap">
            <div v-if="selectedOption === 'getStudentsTestResults'" class="flex gap-5">
                <q-input filled v-model="idCourseForStudentsResults" label="Course ID" class="bg-white rounded-md" />
                <q-input filled v-model="idTest" label="Test ID" class="bg-white rounded-md gap-5" />
            </div>
            <div v-else-if="selectedOption === 'getStudentsOnCourse'" class="flex gap-5">
                <q-input filled v-model="idCourseForStudentsOnCourse" label="Course ID" class="bg-white rounded-md" />
                <q-input filled v-model="idAcademicYear" label="Academic Year" class="bg-white rounded-md gap-5" />
            </div>
            <div v-else-if="selectedOption === 'getTestLogDetails'" class="flex gap-5">
                <q-input filled v-model="idTestInstance" label="Test Instance ID" class="bg-white rounded-md gap-5" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
    setup() {
        const idCourseForStudentsResults = ref("");
        const idTest = ref("");
        const idCourseForStudentsOnCourse = ref("");
        const idAcademicYear = ref("");
        const idTestInstance = ref("");
        const dropdownOptions = ref(["getStudentsTestResults", "getStudentsOnCourse", "getTestLogDetails"]);
        const selectedOption = ref(dropdownOptions.value[0]); // Set the default value to the first option

        return {
            idCourseForStudentsResults,
            idTest,
            idCourseForStudentsOnCourse,
            idAcademicYear,
            idTestInstance,
            dropdownOptions,
            selectedOption,
        };
    },
};
</script>
