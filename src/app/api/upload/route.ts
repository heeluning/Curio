import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { pc, index} from "@/lib/pinecone";
import { Md5 } from "ts-md5";
import { insetFile } from "@/db";

export async function POST(req: Request) {
    try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    // console.log(file);

    // 1. parse docs pages to langchain format
    //  file buffer
    const buffer = await file.arrayBuffer();

    //  Create a Blob from the buffer
    const blob = new Blob([buffer], { type: "application/pdf" });

    const loader = new WebPDFLoader(blob, {
    // required params = ...
    // optional params = ...
    });

    const docs = await loader.load();

    // 2. split docs into smaller chunks
    const splitDocs = await Promise.all(docs.map(doc => splitDoc(doc)));

    // 3. upload to vector db
    const res = await Promise.all(splitDocs.map(embedChunks));

    // 4. save file to db
    await insetFile(file.name, Md5.hashStr(file.name))

    return NextResponse.json({ message: "File uploaded successfully" })

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: "File upload failed" });
    }
}


const splitDoc = async (doc: Document) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 0,
      });
      const texts = await textSplitter.splitText(doc.pageContent);
      return texts
    }


const embedChunks = async (chunks: string[]) => {
    const batchSize = 96;
    // create records with Md5
    const records = chunks.map((chunk, index) => ({
        _id: Md5.hashStr(chunk),
        text: chunk,
        category: 'pdf_document'
    }));

    // batch upsert
    const batches = [];
    for (let i = 0; i < records.length; i += batchSize) {
        batches.push(records.slice(i, i + batchSize));
    }

    for (const batch of batches) {
        await index.upsertRecords(batch);
        // console.log(`Uploaded batch of ${batch.length} records`);
    }
    
    console.log(`Total uploaded: ${records.length} records in ${batches.length} batches`);


}
