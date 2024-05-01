import { useQuasar } from "quasar";

export function useErrorHelper() {
	const $q = useQuasar();

	const displayErrorNotification = (message: string) => {
		$q.notify({
			color: "negative",
			position: "top",
			message,
			icon: "report_problem",
		});
	};

	return {
		displayErrorNotification,
	};
}
