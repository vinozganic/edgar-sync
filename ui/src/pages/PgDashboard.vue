<template>
	<div class="flex h-full flex-row gap-[4%] rounded-lg bg-gray-100 px-16 py-8 flex-nowrap shadow-2xl">
		<div class="flex w-[48%] flex-col gap-5 flex-nowrap">
			<q-input filled v-model="idCourseForStudentsResults" label="Course ID" />
			<q-input filled v-model="idTest" label="Test ID" />
			<q-btn
				class="mx-1"
				push
				color="primary"
				@click="fetchStudentsTestResults"
				label="Get Students Test Results"
				:loading="loadingStudentsTestResults"
			>
				<template v-slot:loading>
					<q-spinner-facebook />
				</template>
			</q-btn>
			<div class="h-full overflow-auto rounded-lg bg-gray-50 select-none">
				<div class="w-full" v-for="(result, index) in studentsTestResults" :key="index">
					<vue-json-pretty :data="result" />
				</div>
			</div>
		</div>
		<div class="flex w-[48%] flex-col gap-5 flex-nowrap">
			<q-input filled v-model="idCourseForStudentsOnCourse" label="Course ID" />
			<q-input filled v-model="idAcademicYear" label="Academic year ID" />
			<q-btn
				class="mx-1"
				push
				color="primary"
				@click="fetchStudentsOnCourse"
				label="Get Students On Course"
				:loading="loadingStudentsOnCourse"
			>
				<template v-slot:loading>
					<q-spinner-facebook />
				</template>
			</q-btn>
			<div class="h-full overflow-auto rounded-lg bg-gray-50 select-none">
				<div class="w-full" v-for="(result, index) in studentsOnCourse" :key="index">
					<vue-json-pretty :data="result" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getStudentsOnCourse, getStudentsTestResults } from "src/services/pgServices";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { useErrorHelper } from "../composables/useErrorHelper";

const studentsTestResults = ref([]);
const studentsOnCourse = ref([]);
const idTest = ref("");
const idCourseForStudentsResults = ref("");
const idCourseForStudentsOnCourse = ref("");
const idAcademicYear = ref("");
const loadingStudentsTestResults = ref(false);
const loadingStudentsOnCourse = ref(false);

const { displayErrorNotification } = useErrorHelper();

const fetchStudentsTestResults = async () => {
	loadingStudentsTestResults.value = true;
	try {
		studentsTestResults.value = await getStudentsTestResults(idTest.value, idCourseForStudentsResults.value);
	} catch (error) {
		displayErrorNotification("Fetching students test results failed");
	} finally {
		loadingStudentsTestResults.value = false;
	}
};

const fetchStudentsOnCourse = async () => {
	loadingStudentsOnCourse.value = true;
	try {
		studentsOnCourse.value = await getStudentsOnCourse(idCourseForStudentsOnCourse.value, idAcademicYear.value);
	} catch (error) {
		displayErrorNotification("Fetching students on course failed");
	} finally {
		loadingStudentsOnCourse.value = false;
	}
};
</script>
