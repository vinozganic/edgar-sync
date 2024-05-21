export const convertQuartzToStandard = (cronExpression: string) => {
    // Quartz format: "20 * * * * ?"
    // Standard format: "20 * * * * *"

    // Split the expression into parts
    const parts = cronExpression.split(" ");

    // Quartz cron format uses '?' for either dayOfMonth or dayOfWeek, replace '?' with '*'
    const convertedParts = parts.map(part => (part === "?" ? "*" : part));

    // If there are 6 parts (Quartz format), add an extra '*' for seconds (standard format)
    if (convertedParts.length === 6) {
        convertedParts.push("*");
    }

    // Join the parts into a standard cron expression
    return convertedParts.join(" ");
};
