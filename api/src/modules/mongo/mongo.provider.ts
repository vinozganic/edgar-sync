import * as mongoose from "mongoose";
import { config } from "dotenv";
import { MONGO_CONNECTION } from "src/config/constants";

config();

const mongoProvider = {
    provide: MONGO_CONNECTION,
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(process.env.MONGO_URL),
};
export default mongoProvider;
