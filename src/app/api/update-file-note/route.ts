import { db } from "@/db/index";
import { fileTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";




export async function POST(req: Request) {

    try {
        const {fileId, note} = await req.json();
        await db.update(fileTable).set({notes: note}).where(eq(fileTable.id, fileId))

        return NextResponse.json({message: "File note updated successfully"})

    } catch (error) {
        console.error('Error updating file note:', error);
        return NextResponse.json({message: "File note update failed"})
    }
}

