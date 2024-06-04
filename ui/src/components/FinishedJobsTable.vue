<template>
    <div class="flex flex-col gap-2 rounded-lg bg-white p-[16px]">
        <div class="flex gap-2 w-full relative h-[38rem]">
            <q-table
                v-if="!loading"
                :rows="allFinishedJobsRef"
                :columns="columns"
                row-key="id"
                class="bg-gray-100 shadow-md w-full"
                :pagination="pagination"
                :rows-per-page-options="[10]"
            >
                <template v-slot:body-cell-location="props">
                    <q-td class="flex justify-center gap-2" :props="props">
                        <q-btn
                            color="primary"
                            class="!bg-green-700"
                            label="Files"
                            @click="openFilesLocation(props.row.location)"
                        />
                        <q-btn color="primary" label="Logs" @click="openLogsLocation(props.row.location)" />
                    </q-td>
                </template>
                <template v-slot:body-cell-isInDatabase="props">
                    <q-td :props="props">
                        <q-icon
                            :size="'md'"
                            :name="props.row.isInDatabase ? 'check' : 'close'"
                            :color="props.row.isInDatabase ? 'green' : 'red'"
                        />
                    </q-td>
                </template>
            </q-table>
            <q-spinner v-else size="lg" color="primary" class="absolute-center" />
            <div class="flex justify-between items-center absolute left-2 bottom-2">
                <q-btn color="primary" icon="refresh" @click="reloadTable" v-show="!loading" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { QTableProps } from "quasar";
import { FinishedScheduledJob } from "src/interfaces/interfaces";

export default defineComponent({
    name: "FinishedJobsTable",
    props: {
        allFinishedJobs: {
            type: Array as () => FinishedScheduledJob[],
            required: true,
            default: () => [],
        },
        loading: {
            type: Boolean,
            required: true,
        },
    },
    emits: ["reload"],
    setup(props, { emit }) {
        const allFinishedJobsRef = computed(() => {
            return props.allFinishedJobs.map((job) => {
                const dateParts = job.timestamp.split("_");
                let hour = parseInt(dateParts[1].split(":")[0]);
                hour = (hour + 2) % 24;
                const updatedTimestamp = `${dateParts[0]} at ${hour.toString().padStart(2, "0")}:${
                    dateParts[1].split(":")[1]
                }`;
                return { ...job, displayedTimestamp: updatedTimestamp };
            });
        });

        const columns: QTableProps["columns"] = [
            {
                name: "displayedTimestamp",
                label: "Job Executed",
                field: "displayedTimestamp",
                align: "center",
                sortable: true,
            },
            { name: "job.uuid", label: "Job ID", field: (row) => row.job.uuid, align: "center", sortable: false },
            { name: "email", label: "Email", field: (row) => row.job.email, align: "center" },
            { name: "location", label: "Minio Location", field: "location", align: "center" },
            { name: "isInDatabase", label: "Job still active", field: "isInDatabase", align: "center" },
        ];

        const pagination = ref({
            sortBy: "displayedTimestamp",
            descending: true,
            page: 1,
            rowsPerPage: 10,
        });

        const openFilesLocation = (location: string) => {
            window.open(`http://localhost:9001/browser/edgar-pipelines/${location}`, "_blank");
        };

        const openLogsLocation = (location: string) => {
            window.open(`http://localhost:9001/browser/edgar-logs/job-logs/${location.split("/")[0]}/`, "_blank");
        };

        const reloadTable = () => {
            emit("reload");
        };

        return {
            allFinishedJobsRef,
            columns,
            pagination,
            openFilesLocation,
            openLogsLocation,
            reloadTable,
        };
    },
});
</script>
