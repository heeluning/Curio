
import { createDeepSeek } from '@ai-sdk/deepseek';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import {pc,index} from "@/lib/pinecone";


const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  
  // get context from db
  const lastMessages = messages[messages.length - 1]

  
  const content = await getContent(lastMessages.parts[0].text)

  const result = streamText({
    // model: openai('gpt-4.1'),
    model: deepseek('deepseek-chat'),
    system: 'You are a helpful assistant. Here is the context:' + content,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

const getContent = async (content: string) => {
  
  const results = await index.searchRecords({
    query: {
      topK: 10,
      inputs: { text: content },
    },
  })

  // console.log(results.result.hits[0].fields)
  return results.result.hits
  .map(hit => (hit.fields as any).text)
  .filter(Boolean)
  .join(' ');
}