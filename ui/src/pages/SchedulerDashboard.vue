<template>
    <div class="flex min-h-[87vh] flex-row gap-[4%] rounded-lg bg-gray-100 px-16 py-8 flex-nowrap shadow-2xl">
        <div class="flex w-full flex-col flex-nowrap gap-4">
            <div class="text-center text-primary">
                <h1 class="text-3xl font-bold">Scheduler Dashboard</h1>
            </div>
            <q-tabs v-model="selectedTab" dense class="bg-white text-teal rounded-lg">
                <q-tab name="new" label="New Job" />
                <q-tab name="existing" label="Existing Job" />
            </q-tabs>
            <q-tab-panels class="rounded-lg" v-model="selectedTab" animated>
                <q-tab-panel name="new" class="flex flex-col gap-2">
                    <q-input filled v-model="newJob.name" label="Job Name" class="w-full bg-white rounded-md" />
                    <q-input filled v-model="newJob.email" label="Email" class="w-full bg-white rounded-md" />
                    <SchedulerMaker
                        :job="newJob"
                        @update-db-query-step="updateNewJobDbQueryStep"
                        @update-script-steps="updateNewJobScriptCardSteps"
                        @update-cron="updateNewJobCronValue"
                    />
                    <q-btn class="w-fit" color="primary" label="Submit" @click="submitNewJobDialogOpen = true" />
                </q-tab-panel>
                <q-tab-panel name="existing" class="flex flex-col gap-2">
                    <q-table :rows="allJobs" :columns="columns" row-key="id" class="bg-gray-100 shadow-md">
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props" class="flex items-center align-middle justify-center gap-2">
                                <q-btn color="primary" size="sm" @click="editJob(props.row)">Edit</q-btn>
                                <q-btn color="negative" size="sm" @click="deleteJob(props.row)">Delete</q-btn>
                            </q-td>
                        </template>
                    </q-table>
                    <div v-show="isSelectedJobToEdit" class="flex gap-2">
                        <q-input
                            filled
                            v-model="existingJob.name"
                            label="Job Name"
                            class="w-full bg-white rounded-md"
                        />
                        <q-input filled v-model="existingJob.email" label="Email" class="w-full bg-white rounded-md" />
                        <SchedulerMaker
                            ref="existingSchedulerMaker"
                            :job="existingJob"
                            @update-db-query-step="updateExistingJobDbQueryStep"
                            @update-script-steps="updateExistingJobScriptCardSteps"
                            @update-cron="updateExistingJobCronValue"
                        />
                        <q-btn
                            class="w-fit"
                            color="primary"
                            label="Submit"
                            @click="submitExistingJobDialogOpen = true"
                        />
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
    <q-dialog v-model="deleteDialogOpen">
        <q-card>
            <q-card-section class="row items-center">
                <q-icon name="warning" color="red" />
                <span class="q-ml-sm">Are you sure you want to delete this job?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn label="Yes" color="negative" @click="confirmDelete" />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="submitNewJobDialogOpen">
        <q-card>
            <q-card-section class="row items-center text-[15px] flex flex-col gap-2 h-full">
                <div class="flex flex-col text-center gap-4">
                    <span>
                        Have you checked if database results, script results and script <b>types</b> are all
                        correct?</span
                    >
                    <span> Have you <b>uploaded</b> all scripts before submitting this job?</span>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="No" color="negative" v-close-popup />
                <q-btn label="Yes - Submit" color="primary" @click="submitPipeline" />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="submitExistingJobDialogOpen">
        <q-card>
            <q-card-section class="row items-center text-[15px] flex flex-col gap-2 h-full">
                <div class="flex flex-col text-center gap-4">
                    <span>
                        Have you checked if database results, script results and script <b>types</b> are all
                        correct?</span
                    >
                    <span>
                        If you added new scripts while editing, have you <b>uploaded</b> all of them before submitting
                        this job?</span
                    >
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="No" color="negative" v-close-popup />
                <q-btn label="Yes - Submit" color="primary" @click="submitPipeline" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue";
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
    email: "",
};

const newJob = ref<Job>({ ...initialJob }); // Novi job koji se kreira
const existingJob = ref<Job>({ ...initialJob }); // Postojeći job koji se ažurira
const allJobs = ref<ScheduledJob[]>([]);
const selectedTab = ref("new");
const deleteDialogOpen = ref(false);
const submitNewJobDialogOpen = ref(false);
const submitExistingJobDialogOpen = ref(false);
const jobToDelete = ref<ScheduledJob | null>(null);
const existingSchedulerMaker = ref<any>(null);

const loadScheduledJobs = async () => {
    try {
        const scheduledJobs = await getAllScheduledJobs();
        allJobs.value = scheduledJobs;
    } catch (error) {
        $q.notify({
            icon: "report_problem",
            type: "negative",
            message: "Fetching all jobs failed.",
        });
    }
};

const isSelectedJobToEdit = computed(() => {
    return existingJob.value.uuid !== initialJob.uuid;
});

const columns: QTableProps["columns"] = [
    { name: "name", label: "Job Name", field: "name", align: "left", sortable: true },
    { name: "cronJob", label: "Cron Expression", field: "cronJob", align: "left", sortable: true },
    { name: "email", label: "Email", field: "email", align: "left", sortable: true },
    { name: "created", label: "Created At", field: "created", align: "left", sortable: true },
    { name: "actions", label: "Actions", field: "", align: "center" },
];

const editJob = async (job: ScheduledJob) => {
    existingJob.value = {
        uuid: job.uuid,
        name: job.name,
        steps: job.steps,
        cronJob: job.cronJob,
        email: job.email,
    };
    selectedTab.value = "existing";
    await nextTick();
    scrollToSchedulerMaker();
};

const scrollToSchedulerMaker = () => {
    const schedulerMakerElement = existingSchedulerMaker.value?.$el;
    if (schedulerMakerElement) {
        schedulerMakerElement.scrollIntoView({ behavior: "smooth" });
    } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
};

const deleteJob = (job: ScheduledJob) => {
    jobToDelete.value = job;
    deleteDialogOpen.value = true;
};

const confirmDelete = async () => {
    if (jobToDelete.value) {
        try {
            const response = await deleteScheduledJob(jobToDelete.value.uuid);
            allJobs.value = allJobs.value.filter((job) => job.uuid !== jobToDelete.value!.uuid);
            $q.notify({
                type: "positive",
                message: `Job successfully deleted. ${response.message}`,
            });
        } catch (error) {
            $q.notify({
                icon: "report_problem",
                type: "negative",
                message: "Failed to delete job. Check logs for more details",
            });
        } finally {
            deleteDialogOpen.value = false;
            jobToDelete.value = null;
            loadScheduledJobs();
        }
    }
};

// Nova funkcija za slanje podataka
const submitPipeline = async () => {
    try {
        submitNewJobDialogOpen.value = false;
        submitExistingJobDialogOpen.value = false;

        if (selectedTab.value === "new") {
            if (!newJob.value.name) {
                $q.notify({
                    icon: "report_problem",
                    type: "negative",
                    message: "Job name is required",
                });
                submitNewJobDialogOpen.value = false;
                return;
            }
            // Kreiranje novog posla
            const response = await createScheduledJob(
                newJob.value.name,
                newJob.value.steps,
                newJob.value.cronJob,
                newJob.value.email
            );
            $q.notify({
                type: "positive",
                message: `New job successfully created. ${response.message}`,
            });
        } else if (selectedTab.value === "existing") {
            // Ažuriranje postojećeg posla
            const response = await updateScheduledJob(
                existingJob.value.uuid,
                existingJob.value.name,
                existingJob.value.steps,
                existingJob.value.cronJob,
                existingJob.value.email
            );
            $q.notify({
                icon: "report_problem",
                type: "positive",
                message: `Job successfully updated. ${response.message}`,
            });
        }
    } catch (error) {
        $q.notify({
            icon: "report_problem",
            type: "negative",
            message: "Failed to submit job. Check logs for more details.",
        });
    } finally {
        loadScheduledJobs();
    }
};

// Funkcija za ažuriranje DbQueryCard koraka u novom poslu
const updateNewJobDbQueryStep = (args: any[]) => {
    newJob.value.steps[0].name = args[0];
    newJob.value.steps[0].args = args.slice(1);
};

// Funkcija za ažuriranje ScriptCard koraka u novom poslu
const updateNewJobScriptCardSteps = (steps: any[]) => {
    newJob.value.steps = [
        newJob.value.steps[0], // Zadržavanje prvog koraka (DbQueryCard)
        ...steps, // Ažurirani ScriptCard koraci
    ];
};

// Funkcija za ažuriranje cron izraza
const updateNewJobCronValue = (newCron: string) => {
    newJob.value.cronJob = newCron;
};

// Funkcija za ažuriranje ScriptCard koraka u postojećem poslu
const updateExistingJobDbQueryStep = (args: any[]) => {
    existingJob.value.steps[0].name = args[0];
    existingJob.value.steps[0].args = args.slice(1);
};

// Funkcija za ažuriranje ScriptCard koraka u postojećem poslu
const updateExistingJobScriptCardSteps = (steps: any[]) => {
    existingJob.value.steps = [
        existingJob.value.steps[0], // Zadržavanje prvog koraka (DbQueryCard)
        ...steps, // Ažurirani ScriptCard koraci
    ];
};

// Funkcija za ažuriranje cron izraza
const updateExistingJobCronValue = (newCron: string) => {
    existingJob.value.cronJob = newCron;
};

onMounted(() => {
    loadScheduledJobs();
});
</script>
