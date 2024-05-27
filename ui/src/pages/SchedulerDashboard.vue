<template>
    <div class="flex min-h-[87vh] flex-row gap-[4%] rounded-lg bg-gray-100 px-16 py-8 flex-nowrap shadow-2xl">
        <div class="flex w-full flex-col flex-nowrap gap-4">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-gray-800">Scheduler Dashboard</h1>
            </div>
            <q-tabs v-model="selectedTab" dense class="bg-white text-teal">
                <q-tab name="new" label="New Job" />
                <q-tab name="existing" label="Existing Job" />
            </q-tabs>
            <q-tab-panels v-model="selectedTab" animated>
                <q-tab-panel name="new">
                    <div class="q-mb-md">
                        <q-input
                            filled
                            v-model="newJob.name"
                            label="Job Name"
                            class="bg-white rounded-md"
                            :rules="[(val) => !!val || 'Name is required']"
                        />
                    </div>
                    <SchedulerMaker :job="newJob" />
                    <q-btn color="primary" label="Submit" @click="submitPipeline" />
                </q-tab-panel>
                <q-tab-panel name="existing">
                    <q-table :rows="allJobs" :columns="columns" row-key="id" class="shadow-md">
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn color="primary" size="sm" @click="editJob(props.row)">Edit</q-btn>
                                <q-btn color="negative" size="sm" @click="deleteJob(props.row)">Delete</q-btn>
                            </q-td>
                        </template>
                    </q-table>
                    <SchedulerMaker :job="existingJob" />
                    <q-btn color="primary" label="Submit" @click="submitPipeline" />
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
    <q-dialog v-model="confirmDeleteDialog">
        <q-card>
            <q-card-section class="row items-center">
                <q-icon name="warning" color="red" />
                <span class="q-ml-sm">Are you sure you want to delete this job?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Yes" color="negative" @click="confirmDelete" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Job, ScheduledJob } from "../interfaces/interfaces";
import {
    getAllScheduledJobs,
    deleteScheduledJob,
    updateScheduledJob,
    createScheduledJob,
} from "src/services/schedulerServices";
import "vue-json-pretty/lib/styles.css";
import { QTabs, QTab, QTabPanels, QTabPanel, QTable, QBtn, QTd, QTableProps, useQuasar } from "quasar";
import SchedulerMaker from "src/components/SchedulerMaker.vue";

const $q = useQuasar();

// Inicijalizacija ref objekata
const initialJob: Job = {
    uuid: "",
    name: "",
    steps: [
        {
            name: "PgGetStudentTestResults",
            args: ["", "", 0],
        },
    ],
    cronJob: "* * * * *",
};

const newJob = ref<Job>({ ...initialJob }); // Novi job koji se kreira
const existingJob = ref<Job>({ ...initialJob }); // Postojeći job koji se ažurira
const allJobs = ref<ScheduledJob[]>([]);
const selectedTab = ref("new");
const confirmDeleteDialog = ref(false);
const jobToDelete = ref<ScheduledJob | null>(null);

const loadScheduledJobs = async () => {
    try {
        const scheduledJobs = await getAllScheduledJobs();
        allJobs.value = scheduledJobs;
        if (allJobs.value.length > 0) {
            existingJob.value = {
                uuid: allJobs.value[0].uuid,
                name: allJobs.value[0].name,
                steps: allJobs.value[0].steps,
                cronJob: allJobs.value[0].cronJob,
            };
        }
        console.log(scheduledJobs);
    } catch (error) {
        console.error("Failed to load scheduled jobs", error);
    }
};

const columns: QTableProps["columns"] = [
    { name: "name", label: "Job Name", field: "name", align: "left", sortable: true },
    { name: "cronJob", label: "Cron Expression", field: "cronJob", align: "left", sortable: true },
    { name: "created", label: "Created At", field: "created", align: "left", sortable: true },
    { name: "actions", label: "Actions", field: "", align: "center" },
];

const editJob = (job: ScheduledJob) => {
    existingJob.value = {
        uuid: job.uuid,
        name: job.name,
        steps: job.steps,
        cronJob: job.cronJob,
    };
    selectedTab.value = "existing";
};

const deleteJob = (job: ScheduledJob) => {
    jobToDelete.value = job;
    confirmDeleteDialog.value = true;
};

const confirmDelete = async () => {
    if (jobToDelete.value) {
        try {
            await deleteScheduledJob(jobToDelete.value.uuid);
            allJobs.value = allJobs.value.filter((job) => job.uuid !== jobToDelete.value!.uuid);
            $q.notify({
                type: "positive",
                message: "Job successfully deleted",
            });
        } catch (error) {
            console.error("Failed to delete job", error);
            $q.notify({
                type: "negative",
                message: "Failed to delete job",
            });
        } finally {
            confirmDeleteDialog.value = false;
            jobToDelete.value = null;
        }
    }
};

// Nova funkcija za slanje podataka
const submitPipeline = async () => {
    try {
        if (selectedTab.value === "new") {
            if (!newJob.value.name) {
                $q.notify({
                    type: "negative",
                    message: "Job name is required",
                });
                return;
            }
            // Kreiranje novog posla
            await createScheduledJob(newJob.value.name, newJob.value.steps, newJob.value.cronJob);
            $q.notify({
                type: "positive",
                message: "New job successfully created",
            });
        } else if (selectedTab.value === "existing") {
            // Ažuriranje postojećeg posla
            await updateScheduledJob(
                existingJob.value.uuid,
                existingJob.value.name,
                existingJob.value.steps,
                existingJob.value.cronJob
            );
            $q.notify({
                type: "positive",
                message: "Job successfully updated",
            });
        }
    } catch (error) {
        console.error("Failed to submit job", error);
        $q.notify({
            type: "negative",
            message: "Failed to submit job",
        });
    }
};

onMounted(() => {
    loadScheduledJobs();
});

console.log(newJob.value);
</script>
