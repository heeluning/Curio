import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { fileTable } from './schema';
  
const db = drizzle(process.env.DATABASE_URL!);

export const insetFile = async (file_name: string, file_key: string) => {
    await db.insert(fileTable).values(
        {
            file_name,
            file_key
        }
    )
}

export const getFile = async () => {
    return await db.select().from(fileTable)
}
