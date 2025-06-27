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
    console.log(`[TOOL / Graph Analyzer] => Analyzing ${person_a} and ${person_b}`);

    try {
      // Paso 1: Pide a GPT un Cypher
      const cypherPrompt = `
        You are working with a Neo4j knowledge graph designed to model the life, thoughts, and memories of a user and their relationships.
        The persons involved are "${person_a}" and "${person_b}".
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
        MATCH (p1:Person {name: $person_a})-[r]-(p2:Person {name: $person_b})
        Do not include any additional text or explanations.
      `;

      const {
        steps: [cypherStep],
      } = await generateText({
        model: openai.responses('gpt-4o'),
        prompt: cypherPrompt,
        temperature: 0.2,
      });

      const generatedCypher = cypherStep.text.trim();
      console.log('[TOOL / Graph Analyzer] => Generated Cypher:', generatedCypher);

      // Paso 2: Ejecutar el Cypher
      session = driver.session();
      const cypherResult = await session.run(generatedCypher);
      const records = cypherResult.records.map((record) => record.toObject());
      console.log('[TOOL / Graph Analyzer] => Cypher result:', records);

      // Paso 3: Pide a GPT que analice el resultado
      const analysisPrompt = `
        You are an assistant analyzing the relationship between "${person_a}" and "${person_b}".
        The following is the result of a Cypher query from a Neo4j database:

        ${JSON.stringify(records, null, 2)}

        Summarize the relationship between the two people in a natural and meaningful way.
        Explain how they are connected but not in a technical manner.
        Focus on the emotional, social, and contextual aspects of their relationship.
      `;

      const {
        steps: [analysisStep],
      } = await generateText({
        model: openai.responses('gpt-4o'),
        prompt: analysisPrompt,
        temperature: 0.7,
      });

      return {
        text: analysisStep.text.trim(),
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
