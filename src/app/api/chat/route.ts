import { openai } from '@ai-sdk/openai';
import { graphRelationshipAnalyzerTool } from '@lib/tools/graphRelationshipAnalyzerTools';
import { personNodeLookupTool } from '@lib/tools/personNodeLookupTool';
import { streamText } from 'ai';
// import { cypherBuilderTool } from '@lib/tools/cypher-builder';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai.responses('gpt-4o'),
    messages,
    tools: {
      web_search_preview: openai.tools.webSearchPreview(),
      // cypher_builder: cypherBuilderTool,
      graphRelationshipAnalyzerTool: graphRelationshipAnalyzerTool,
      personNodeLookup: personNodeLookupTool,
    },
    maxSteps: 3,
    maxTokens: 4096, // Maximo de tokens a devolver
    temperature: 0.8, // Entre 0 y 1, entre mas alto mas creativo
    topP: 1, // Entre 0 y 1, entre mas alto mas creativo
    frequencyPenalty: 1, // Entre -2 y 2, entre mas alto menos repetitivo
    presencePenalty: 1, // Entre -2 y 2, entre mas alto menos repetitivo
  });

  return result.toDataStreamResponse();
}
