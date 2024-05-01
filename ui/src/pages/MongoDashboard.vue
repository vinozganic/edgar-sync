<template>
	<div class="flex h-full flex-col gap-[4%] rounded-lg bg-gray-100 px-16 py-8 flex-nowrap shadow-2xl">
		<q-input filled v-model="idTestInstance" label="Test Instance ID" />
		<q-btn
			class="mx-1"
			push
			color="primary"
			@click="fetchTestLogDetails"
			label="Get Test Log Details"
			:loading="loading"
		>
			<template v-slot:loading>
				<q-spinner-facebook />
			</template>
		</q-btn>
		<div class="bg-gray-50 rounded-lg h-full overflow-auto select-none">
			<div class="w-full" v-for="(result, index) in testLogDetails" :key="index">
				<vue-json-pretty :data="result" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { getTestLogDetails } from "src/services/mongoServices";
import { useErrorHelper } from "../composables/useErrorHelper";

defineOptions({
	name: "MongoDashboard",
	components: {
		VueJsonPretty,
	},
});

const idTestInstance = ref("");
const testLogDetails = ref({});
const loading = ref(false);

const { displayErrorNotification } = useErrorHelper();

const fetchTestLogDetails = async () => {
	loading.value = true;
	try {
		testLogDetails.value = await getTestLogDetails(idTestInstance.value);
	} catch (error) {
		displayErrorNotification("Fetching test log details failed");
	} finally {
		loading.value = false;
	}
};
</script>
