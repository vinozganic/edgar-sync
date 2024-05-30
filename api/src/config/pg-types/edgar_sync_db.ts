import type { ColumnType } from "kysely";

export type Generated<T> =
    T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
    [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface ScheduledJobs {
    created: Generated<Timestamp | null>;
    cronJob: string;
    id: Generated<number>;
    lastModified: Generated<Timestamp | null>;
    name: string;
    steps: Json;
    uuid: Generated<string>;
}

export interface EdgarSyncDB {
    scheduledJobs: ScheduledJobs;
}
