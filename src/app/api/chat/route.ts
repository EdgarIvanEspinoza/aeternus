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
    max_tokens: 500, // Maximo de tokens a devolver
    temperature: 0.8, // Entre 0 y 1, entre mas alto mas creativo
    top_p: 1, // Entre 0 y 1, entre mas alto mas creativo
    frequency_penalty: 1, // Entre -2 y 2, entre mas alto menos repetitivo
    presence_penalty: 1, // Entre -2 y 2, entre mas alto menos repetitivo
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
