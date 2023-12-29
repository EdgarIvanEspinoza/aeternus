import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);
export const runtime = 'edge';

export async function POST(request: Request) {
  let { messages } = await request.json();

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages,
    max_tokens: 500,
    temperature: 0.8,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
