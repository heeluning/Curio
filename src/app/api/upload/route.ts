import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import {pc} from "@/lib/pinecone";
import { Md5 } from "ts-md5";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    console.log(file);

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
    //  console.log(docs[0].pageContent);

    // 2. split docs into smaller chunks
    //   text split
    const splitDocs = await Promise.all(docs.map(doc =>  splitDoc(doc)));
    // embedding pinecore
    const res = await Promise.all(splitDocs.map(embedChunks));
    // console.log(res);


    // upload to vector db

    return NextResponse.json({ message: "File uploaded successfully" })
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
    const indexName = 'curio';
    const model = 'multilingual-e5-large';

        
    // 创建索引（如果不存在）
    try {
        await pc.createIndexForModel({
            name: indexName,
            cloud: 'aws',
            region: 'us-east-1',
            embed: {
                model: 'multilingual-e5-large',
                fieldMap: { text: 'chunk_text' },
            },
            waitUntilReady: true,
        });
    } catch (error) {
        console.log('Index might already exist:', error);
    }

    // const embeddings = await pc.inference.embed(
    //     model,
    //     chunks,
    //     { inputType: 'passage', truncate: 'END' }
    //   );

    // creaet records with Md5
    const records = chunks.map((chunk, index) => ({
        _id: Md5.hashStr(chunk),
        chunk_text: chunk,
        category: 'pdf_document'
    }));
    // const records = chunks.map((c, i) => ({
    //     id: Md5.hashStr(c),
    //     values: embeddings[i].values,
    //     chunk_text: c,
    //     metadata: {text:c}
    //     category: 'pdf_document'
    // }));
    // console.log(records);
    const index = pc.index(indexName).namespace("__default__");
    return await index.upsertRecords(records)
}