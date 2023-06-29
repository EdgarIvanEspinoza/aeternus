import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);
export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  // Ask OpenAI for a streaming chat completion given the prompt

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
    stop: ['\n', 'User:', 'Aeternus:'],
    temperature: 0.9,
    max_tokens: 150,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
