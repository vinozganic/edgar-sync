import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("layouts/Layout.vue"),
		children: [
			{ path: "", component: () => import("pages/IndexPage.vue") },
			{ path: "/pg", component: () => import("pages/PgDashboard.vue") },
			{ path: "/mongo", component: () => import("pages/MongoDashboard.vue") },
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
