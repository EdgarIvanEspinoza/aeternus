import { z } from 'zod';
import { generateText, Tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import driver from '../neo4j/driver';

export const graphRelationshipAnalyzerTool: Tool = {
  description:
    'Tool to analyze the relationship between two people using the knowledge graph. Use it when the user asks how two people are connected or related.',
  parameters: z.object({
    person_a: z.string().describe('First person to analyze'),
    person_b: z.string().describe('Second person to analyze'),
  }),
  async execute({ person_a, person_b }) {
    let session;
    const startTotal = Date.now();
    console.log(`[TOOL / Graph Analyzer] START person_a='${person_a}' person_b='${person_b}'`);
    // Normalizar referencias al propio asistente / IA para que siempre se busque como 'Lequi'
    const SELF_ALIASES = [
      'lequi',
      'lazar',
      'lazar schwartzman',
      'assistant',
      'la ia',
      'ia',
      'the ai',
      'you',
      'tu',
      'vos',
      'yourself',
      'your self',
    ];

    const normalizePerson = (raw: string): string => {
      const lowered = raw.trim().toLowerCase();
      if (SELF_ALIASES.includes(lowered)) return 'Lequi';
      // Si el usuario pasa comillas, limpiar
      return raw.replace(/^"|"$/g, '').trim();
    };

    const pA = normalizePerson(person_a);
    const pB = normalizePerson(person_b);
    console.log(`[TOOL / Graph Analyzer] => Normalized to ${pA} and ${pB}`);
    try {
      // Paso 1: Pide a GPT un Cypher
      const cypherPrompt = `
        You are working with a Neo4j knowledge graph designed to model the life, thoughts, and memories of a user and their relationships.
        The persons involved are "${pA}" and "${pB}".
        IMPORTANT: If one of the persons is the AI itself (the assistant), it is always stored as the Person node with name "Lequi".
        This graph contains **custom nodes** and **relationships** with labeled semantics. Your job is to understand the available node types, how they connect, and how to generate Cypher queries to retrieve or update this knowledge.

        ---

        🧩 NODE TYPES:

        You can interact with the following node types:

        1. **Person** – Represents a human individual
        2. **Mascot** – Represents an animal companion.
        3. **Pending_Events** – Future or upcoming events relevant to the user.
        4. **Past_Conversations** – Saved dialogues or interactions with the AI or others.
        5. **Short_Term_Mem** – Recent memories with high accessibility.
        6. **Medium_Term_Mem** – Intermediate-term memories, relevant but less recent.
        7. **Long_Term_Mem** – Significant memories with lasting emotional or factual impact.
        8. **Advice** – Guidance given or received.
        9. **Opinion** – Expressed beliefs or views of the user or others.
        10. **Personal_Preference** – Likes, dislikes, tendencies, or tastes.
        11. **Personal_Possession** – Belongings, objects, tools or artifacts owned.
        12. **Activities** – Repeated or one-off actions the user engages in.
        13. **Thoughts** – Internal reflections, plans, or considerations.
        14. **World_News** – Information from the external world relevant to the user.
        15. **Conversation_Log** – Historical transcripts of full sessions or exchanges.

        Each of these nodes may have properties like:
        - 'createdAt', 'updatedAt', 'content', 'source', 'importance', 'emotionalTone', 'confidence', 'contextTags', etc.

        ---

        🔗 RELATIONSHIP TYPES:

        The following **relationship types** link nodes and define the graph's semantics. These can exist between people, memories, thoughts, events, etc.

        (See full breakdown above: Parental, Friendship, Contact, Nicknames, Sentiment, Feelings_About, Preferences, Agreement, etc.)

        All relationships may include properties like:
        - 'dateOfStart', 'flavor', 'tone', 'confidence', 'magnitude', 'affinity', etc.

        ---

        🔎 OBJECTIVE:

        Your job is to:

        Generate a **Cypher query** that finds the relationship(s) between them and retrieves any relevant information.

        When building or querying the graph:
        - Prioritize meaningful, emotionally loaded, or memory-relevant information.
        - Keep consistency in node types and their attributes.
        - Use MATCH / MERGE / SET as appropriate.

        return only the Cypher query, without any additional text or explanation and no markdown.
        Example Cypher query:
        MATCH (p1:Person {name: $personA})-[r]-(p2:Person {name: $personB})
        Do not include any additional text or explanations.
      `;

      const startGen = Date.now();
      const {
        steps: [cypherStep],
      } = await generateText({ model: openai.responses('gpt-4o'), prompt: cypherPrompt, temperature: 0.2 });
      console.log('[TOOL / Graph Analyzer] Cypher generation time:', Date.now() - startGen, 'ms');

      const generatedCypher = cypherStep.text.trim();
      console.log('[TOOL / Graph Analyzer] => Generated Cypher:', generatedCypher);

      // Paso 2: Ejecutar el Cypher
      session = driver.session();
      // Ejecutar de forma segura: si el modelo no incluyó parámetros esperados, usar fallback parametrizado
      const safeQuery =
        /\$personA/.test(generatedCypher) && /\$personB/.test(generatedCypher)
          ? generatedCypher
          : 'MATCH (p1:Person {name: $personA})-[r]-(p2:Person {name: $personB}) RETURN p1, p2, r LIMIT 50';

      const startQuery = Date.now();
      const cypherResult = await session.run(safeQuery, { personA: pA, personB: pB });
      console.log('[TOOL / Graph Analyzer] Relationship query time:', Date.now() - startQuery, 'ms');
      const records = cypherResult.records.map((record) => record.toObject());
      console.log('[TOOL / Graph Analyzer] => Cypher result:', records);

      // Paso 2.1: Recuperar toda la información (propiedades + relaciones) de cada nodo Person investigado
      // Incluye todas las relaciones (entrantes y salientes) y los nombres de los otros nodos Person conectados.
      const fullDataQuery = `/* full person data */
        MATCH (p1:Person {name: $personA})
        MATCH (p2:Person {name: $personB})
        OPTIONAL MATCH (p1)-[r1]-(o1:Person)
        WITH p1, p2, collect(DISTINCT {
          type: type(r1),
          other: o1.name,
          direction: CASE WHEN startNode(r1) = p1 THEN 'OUT' ELSE 'IN' END,
          properties: properties(r1)
        }) AS p1Relationships
        OPTIONAL MATCH (p2)-[r2]-(o2:Person)
        RETURN p1, p1Relationships, p2, collect(DISTINCT {
          type: type(r2),
          other: o2.name,
          direction: CASE WHEN startNode(r2) = p2 THEN 'OUT' ELSE 'IN' END,
          properties: properties(r2)
        }) AS p2Relationships
      `;

      interface PersonFullData {
        name: string;
        properties: Record<string, unknown>;
        relationships: Array<{ type: string; other: string; direction: string; properties: Record<string, unknown> }>;
      }
      let personAData: PersonFullData | null = null;
      let personBData: PersonFullData | null = null;
      try {
        const startFull = Date.now();
        const fullDataResult = await session.run(fullDataQuery, { personA: pA, personB: pB });
        console.log('[TOOL / Graph Analyzer] Full node data query time:', Date.now() - startFull, 'ms');
        if (fullDataResult.records.length > 0) {
          const rec = fullDataResult.records[0];
          const p1Node = rec.get('p1');
          const p2Node = rec.get('p2');
          const p1Relationships = rec.get('p1Relationships');
          const p2Relationships = rec.get('p2Relationships');
          personAData = {
            name: p1Node?.properties?.name ?? pA,
            properties: p1Node?.properties ?? {},
            relationships: Array.isArray(p1Relationships) ? p1Relationships : [],
          };
          personBData = {
            name: p2Node?.properties?.name ?? pB,
            properties: p2Node?.properties ?? {},
            relationships: Array.isArray(p2Relationships) ? p2Relationships : [],
          };
        }
      } catch (fullErr) {
        console.warn('[TOOL / Graph Analyzer] => Could not load full node data:', fullErr);
      }

      // Paso 3: Pide a GPT que analice el resultado
      // TODO: Rehace el prompt para quitar el Assistant y hacerlo mas natural
      const analysisPrompt = `
        You are an assistant analyzing the relationship between "${person_a}" and "${person_b}".
        The following is the result of a Cypher query from a Neo4j database:

        ${JSON.stringify(records, null, 2)}

        Full node data:
        Person A (${pA}): ${JSON.stringify(personAData, null, 2)}
        Person B (${pB}): ${JSON.stringify(personBData, null, 2)}

        Summarize the relationship between the two people in a natural and meaningful way.
        Explain how they are connected but not in a technical manner.
        Focus on the emotional, social, and contextual aspects of their relationship.
      `;

      const startAnalysis = Date.now();
      const {
        steps: [analysisStep],
      } = await generateText({ model: openai.responses('gpt-4o'), prompt: analysisPrompt, temperature: 0.7 });
      // Ensure the step has text to avoid returning an empty step to the caller
      const analysisText = analysisStep?.text?.trim();
      if (!analysisText) {
        console.warn('[TOOL / Graph Analyzer] analysisStep returned empty text — using fallback summary');
      }
      console.log('[TOOL / Graph Analyzer] Analysis LLM time:', Date.now() - startAnalysis, 'ms');

      const totalMs = Date.now() - startTotal;
      console.log('[TOOL / Graph Analyzer] COMPLETE in', totalMs, 'ms');
      return {
        text: analysisText || `I found connections between ${pA} and ${pB} but couldn't summarize them right now.`,
        personA: personAData,
        personB: personBData,
        rawRecords: records,
        timings: { totalMs },
      };
    } catch (err) {
      console.error('[TOOL / Graph Analyzer] => Error:', err);
      return {
        text: `I'm having trouble understanding how ${person_a} and ${person_b} are related.`,
      };
    } finally {
      if (session) await session.close();
    }
  },
};
