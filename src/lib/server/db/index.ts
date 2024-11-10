import * as schema from "./schema";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
