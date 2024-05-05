<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar class="flex gap-4">
				<div class="cursor-pointer select-none" @click="$router.push('pg')">
					<q-img class="w-6 object-contain flex-shrink-0" src="~assets/edgar.png" alt="Edgar Logo" />
				</div>
				<q-toolbar-title class="select-none"> edgar-sync </q-toolbar-title>
				<q-tabs>
					<q-route-tab to="/pg" exact label="Pg" />
					<q-route-tab to="/mongo" exact label="Mongo" />
				</q-tabs>
				<div>Admin/Teacher</div>
			</q-toolbar>
		</q-header>

		<q-page-container class="h-screen px-36 !pt-20 pb-8">
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
defineOptions({
	name: "MainLayout",
});
</script>
