import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { cypherBuilderTool } from '@lib/tools/cypher-builder';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai.responses('gpt-4o-mini'),
    messages,
    tools: {
      web_search_preview: openai.tools.webSearchPreview(),
      cypher_builder: cypherBuilderTool,
    },
    maxSteps: 3,
    maxTokens: 5000, // Maximo de tokens a devolver
    temperature: 0.6, // Entre 0 y 1, entre mas alto mas creativo
    topP: 1, // Entre 0 y 1, entre mas alto mas creativo
    frequencyPenalty: 1, // Entre -2 y 2, entre mas alto menos repetitivo
    presencePenalty: 1, // Entre -2 y 2, entre mas alto menos repetitivo
  });

  return result.toDataStreamResponse();
}
