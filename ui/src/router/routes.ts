import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{ path: "", component: () => import("pages/IndexPage.vue") },
			{ path: "/pipeline", component: () => import("pages/PipelineDashboard.vue") },
			{ path: "scheduler", component: () => import("pages/SchedulerDashboard.vue") },
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("pages/ErrorNotFound.vue"),
	},
];

export default routes;
