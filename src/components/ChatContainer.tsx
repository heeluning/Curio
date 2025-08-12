'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';

type Props = {}

const ChatContainer = (props: Props) => {


  const { messages, sendMessage, status } = useChat({
      transport: new DefaultChatTransport({
        api: '/api/chat',
        }),
      });
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Chat messages */} 
      <div className="flex-1 flew flew-col gap-2 h-full overflow-y-auto">
        {messages.map(message => (
          <div key={message.id} 
          className={`p-2 flex flex-row ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p className={`p-2 text-sm inline-block break-words whitespace-pre-wrap rounded-lg max-w-[80%] ${
               message.role === 'user' 
                 ? 'bg-blue-100' 
                 : 'bg-white'
             }`}>

            

            {message.parts.map((part, index) =>
              part.type === 'text' ? <span key={index}>{part.text}</span> : null,
            )}
            </p>

            <div ref={endRef}></div>
          </div>
        ))}
      </div>

      {/* Input form */}
      <form
      onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      className='flex flex-row gap-2 p-2 h-20'>

        <input
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={status !== 'ready'}
        placeholder="Say something..."
        className='flex-1 rounded-lg bg-white border px-3 py-2'
        />

        <Button 
        type="submit" disabled={status !== 'ready'}
        className='h-full'>
          Submit
        </Button>
      </form>

    </div>
  );
}


export default ChatContainer