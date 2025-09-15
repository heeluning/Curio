import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { fileTable } from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(process.env.DATABASE_URL!);

try {
    await client`SELECT 1`;
    console.log('✅ Database connection successful');
    
} catch (error) {
    console.error('❌ Database connection failed:', error);
    
}

export const insetFile = async (file_name: string, file_key: string, notes: string | null) => {
    await db.insert(fileTable).values(
        {
            file_name,
            file_key,
            notes: notes || null
        }
    )
}

export const getFile = async () => {
    return await db.select().from(fileTable)
}
