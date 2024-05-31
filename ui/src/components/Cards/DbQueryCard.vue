<template>
    <div class="flex w-full gap-5 bg-green-700 rounded-md p-4 flex-wrap justify-stretch">
        <div class="flex flex-wrap gap-5 w-full">
            <div v-show="selectedOption === 'PgGetStudentTestResults'" class="flex gap-5 w-full">
                <q-select
                    filled
                    v-model="selectedOption"
                    :options="dropdownOptions"
                    label="Select query"
                    class="bg-white rounded-md"
                />
                <q-select
                    filled
                    v-model="selectedDbResultsType"
                    :options="['json', 'csv']"
                    label="Select DB Results Type"
                    class="bg-white rounded-md w-40"
                />
                <q-input filled v-model="idTest" label="Test ID" class="bg-white rounded-md gap-5" />
                <q-input filled v-model="idCourseForStudentsResults" label="Course ID" class="bg-white rounded-md" />
            </div>
            <div v-show="selectedOption === 'PgGetStudentsOnCourse'" class="flex gap-5">
                <q-select
                    filled
                    v-model="selectedOption"
                    :options="dropdownOptions"
                    label="Select query"
                    class="bg-white rounded-md"
                />
                <q-select
                    filled
                    v-model="selectedDbResultsType"
                    :options="['json', 'csv']"
                    label="Select DB Results Type"
                    class="bg-white rounded-md w-40"
                />
                <q-input filled v-model="idCourseForStudentsOnCourse" label="Course ID" class="bg-white rounded-md" />
                <q-input filled v-model="idAcademicYear" label="Academic Year" class="bg-white rounded-md gap-5" />
            </div>
            <div v-show="selectedOption === 'MongoGetTestLogDetails'" class="flex gap-5">
                <q-select
                    filled
                    v-model="selectedOption"
                    :options="dropdownOptions"
                    label="Select query"
                    class="bg-white rounded-md"
                />
                <q-input filled v-model="idTestInstance" label="Test Instance ID" class="bg-white rounded-md gap-5" />
            </div>
            <div v-show="selectedOption === 'PgCustomSQLQuery'" class="flex gap-5 w-full">
                <q-select
                    filled
                    v-model="selectedOption"
                    :options="dropdownOptions"
                    label="Select query"
                    class="bg-white rounded-md"
                />
                <q-select
                    filled
                    v-model="selectedDbResultsType"
                    :options="['json', 'csv']"
                    label="Select DB Results Type"
                    class="bg-white rounded-md w-40"
                />
                <q-input class="bg-white w-full rounded-lg" v-model="sqlCode" autogrow filled />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, Ref, computed, watch, onMounted } from "vue";
import { DbResultsType } from "src/enums/DbResultsType";

export default {
    name: "DbQueryCard",
    emits: ["update-args"],
    props: {
        jobProps: {
            type: Object,
            required: false,
        },
    },
    setup(props, { emit }) {
        // PgGetStudentTestResults
        const idTest = ref("");
        const idCourseForStudentsResults = ref("");
        // PgGetStudentsOnCourse
        const idCourseForStudentsOnCourse = ref("");
        const idAcademicYear = ref("");
        // MongoGetTestLogDetails
        const idTestInstance = ref("");
        // PgCustomSQLQuery
        const sqlCode = ref("");

        const dropdownOptions = ref([
            "PgGetStudentTestResults",
            "PgGetStudentsOnCourse",
            "MongoGetTestLogDetails",
            "PgCustomSQLQuery",
        ]);
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
                    return [selectedOption.value, idTestInstance.value];
                case "PgCustomSQLQuery":
                    return [selectedOption.value, sqlCode.value, DbResultsType[selectedDbResultsType.value]];
                default:
                    return [];
            }
        });

        const MONACO_EDITOR_OPTIONS = {
            automaticLayout: true,
            formatOnType: true,
            formatOnPaste: true,
        };

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
                sqlCode,
            ],
            emitArgs,
            { deep: true }
        );

        watch(
            () => props.jobProps,
            (newProps) => {
                console.log(newProps);
                selectedOption.value = newProps?.name;
                switch (newProps?.name) {
                    case "PgGetStudentTestResults":
                        idTest.value = newProps.args[0];
                        idCourseForStudentsResults.value = newProps.args[1];
                        selectedDbResultsType.value = DbResultsType[newProps.args[2]] as keyof typeof DbResultsType;
                        break;
                    case "PgGetStudentsOnCourse":
                        idCourseForStudentsOnCourse.value = newProps.args[0];
                        idAcademicYear.value = newProps.args[1];
                        selectedDbResultsType.value = DbResultsType[newProps.args[2]] as keyof typeof DbResultsType;
                        break;
                    case "MongoGetTestLogDetails":
                        idTestInstance.value = newProps.args[0];
                        break;
                    case "PgCustomSQLQuery":
                        sqlCode.value = newProps.args[0];
                        selectedDbResultsType.value = DbResultsType[newProps.args[1]] as keyof typeof DbResultsType;
                        break;
                }
            }
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
            MONACO_EDITOR_OPTIONS,
            sqlCode,
        };
    },
};
</script>
