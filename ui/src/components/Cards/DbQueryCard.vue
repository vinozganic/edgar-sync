<template>
    <div class="flex w-full gap-5 bg-green-700 rounded-md p-4 flex-wrap justify-stretch">
        <div>
            <q-select
                filled
                v-model="selectedOption"
                :options="dropdownOptions"
                label="Select query"
                class="bg-white rounded-md"
            />
        </div>
        <div class="flex flex-wrap gap-5">
            <q-select
                filled
                v-model="selectedDbResultsType"
                :options="['json', 'csv']"
                label="Select DB Results Type"
                class="bg-white rounded-md w-40"
            />
            <div v-if="selectedOption === 'PgGetStudentTestResults'" class="flex gap-5">
                <q-input filled v-model="idTest" label="Test ID" class="bg-white rounded-md gap-5" />
                <q-input filled v-model="idCourseForStudentsResults" label="Course ID" class="bg-white rounded-md" />
            </div>
            <div v-else-if="selectedOption === 'PgGetStudentsOnCourse'" class="flex gap-5">
                <q-input filled v-model="idCourseForStudentsOnCourse" label="Course ID" class="bg-white rounded-md" />
                <q-input filled v-model="idAcademicYear" label="Academic Year" class="bg-white rounded-md gap-5" />
            </div>
            <div v-else-if="selectedOption === 'MongoGetTestLogDetails'" class="flex gap-5">
                <q-input filled v-model="idTestInstance" label="Test Instance ID" class="bg-white rounded-md gap-5" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, Ref, computed, defineComponent, watch, onMounted } from "vue";
import { DbResultsType } from "src/enums/DbResultsType";

export default {
    name: "DbQueryCard",
    emits: ["update-args"],
    setup(props, { emit }) {
        // PgGetStudentTestResults
        const idTest = ref("");
        const idCourseForStudentsResults = ref("");
        // PgGetStudentsOnCourse
        const idCourseForStudentsOnCourse = ref("");
        const idAcademicYear = ref("");
        // MongoGetTestLogDetails
        const idTestInstance = ref("");

        const dropdownOptions = ref(["PgGetStudentTestResults", "PgGetStudentsOnCourse", "MongoGetTestLogDetails"]);
        const selectedOption = ref(dropdownOptions.value[0]);

        const selectedDbResultsType: Ref<keyof typeof DbResultsType> = ref("json");

        const args = computed(() => {
            switch (selectedOption.value) {
                case "PgGetStudentTestResults":
                    return [
                        selectedOption.value,
                        idTest.value,
                        idCourseForStudentsResults.value,
                        DbResultsType[selectedDbResultsType.value],
                    ];
                case "PgGetStudentsOnCourse":
                    return [
                        selectedOption.value,
                        idCourseForStudentsOnCourse.value,
                        idAcademicYear.value,
                        DbResultsType[selectedDbResultsType.value],
                    ];
                case "MongoGetTestLogDetails":
                    return [selectedOption.value, idTestInstance.value, DbResultsType[selectedDbResultsType.value]];
                default:
                    return [];
            }
        });

        const emitArgs = () => {
            emit("update-args", args.value);
        };

        // Page load
        onMounted(() => {
            emitArgs();
        });

        watch(
            [
                idTest,
                idCourseForStudentsResults,
                idCourseForStudentsOnCourse,
                idAcademicYear,
                idTestInstance,
                selectedOption,
                selectedDbResultsType,
            ],
            emitArgs,
            { deep: true }
        );

        return {
            idCourseForStudentsResults,
            idTest,
            idCourseForStudentsOnCourse,
            idAcademicYear,
            idTestInstance,
            dropdownOptions,
            selectedOption,
            selectedDbResultsType,
            DbResultsType,
        };
    },
};
</script>
