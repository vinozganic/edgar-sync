import { boot } from "quasar/wrappers";
import CronQuasarPlugin from "@vue-js-cron/quasar";

export default boot(({ app }) => {
    app.use(CronQuasarPlugin);
});
