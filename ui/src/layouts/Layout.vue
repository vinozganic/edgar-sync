<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar class="flex gap-4">
				<q-toolbar-title> Pipeline App </q-toolbar-title>
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
