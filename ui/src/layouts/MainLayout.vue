<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated class="">
            <q-toolbar class="flex gap-4">
                <div class="cursor-pointer select-none" @click="$router.push('pipeline')">
                    <q-img class="w-6 object-contain flex-shrink-0" src="~assets/edgar.png" alt="Edgar Logo" />
                </div>
                <q-toolbar-title class="select-none font-[500]"> edgar-sync </q-toolbar-title>
                <q-tabs>
                    <q-route-tab to="/pipeline" exact label="Pipeline" />
                    <q-route-tab to="/scheduler" exact label="Scheduler" />
                </q-tabs>
                <div>Admin/Teacher</div>
            </q-toolbar>
        </q-header>

        <q-page-container class="min-h-screen px-28 !pt-20 pb-8">
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
defineOptions({
    name: "MainLayout",
});
</script>
