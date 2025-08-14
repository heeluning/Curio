import {getFile} from "@/db";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    const files = await getFile()
    return NextResponse.json(files)

}