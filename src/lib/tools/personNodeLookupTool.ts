import { z } from 'zod';
import { generateText, Tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import driver from '../neo4j/driver';

// Single Person Node Lookup Tool
// 1. Generates (via GPT) a Cypher query to fetch the Person node plus its direct relationships to any node.
// 2. Executes a safe fallback query if the generated one is malformed.
// 3. Fetches enriched relationship data (direction, type, connected node label + key properties).
// 4. Summarizes the person context (properties + relationship distribution).
// NOTE: Self references (assistant) are normalized to 'Lequi'.

const SELF_ALIASES = [
  'lequi',
  'lequi schwartzman',
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
  return raw.replace(/^"|"$/g, '').trim();
};

export const personNodeLookupTool: Tool = {
  description:
    'Fetch full profile of a single person (properties + direct relationships). Use it everytime a Person is mentioned in the conversation. Avoid calling for trivial greetings or repeated lookups without new context.',
  parameters: z.object({
    query: z.string().describe('Name or email of the person to inspect'),
  }),
  async execute({ query }) {
    const startTotal = Date.now();
    let session;
    const target = normalizePerson(query);
    console.log(`[TOOL / Person Lookup GPT] START target='${target}' raw='${query}'`);
    if (target === 'Lequi') {
      return { text: 'Skipped self lookup (assistant = Lequi).', person: null };
    }
    try {
      // 1. Ask GPT for a Cypher tailored to the person (may include flexible patterns)
      const cypherPrompt = `You are generating a Neo4j Cypher query to retrieve one Person node and its direct relationships.\nPerson of interest: "${target}".\nRequirements:\n- Try to match either by exact name OR (if not found) by case-insensitive name (use toLower).\n- Return the person node as p and each relationship plus the connected node.\n- Limit to a reasonable number (<= 200 relationships) to avoid overload.\nReturn ONLY the Cypher, no markdown, no commentary.\nExample pattern to inspire (do not just copy blindly):\nMATCH (p:Person {name: $name}) OPTIONAL MATCH (p)-[r]-(o) RETURN p, r, o LIMIT 200`;

      const {
        steps: [cypherStep],
      } = await generateText({ model: openai.responses('gpt-4o'), prompt: cypherPrompt, temperature: 0.1 });
      let generatedCypher = cypherStep.text.trim();
      // Remove code block delimiters and extra whitespace
      generatedCypher = generatedCypher.replace(/```/g, '').trim();
      console.log('[TOOL / Person Lookup GPT] Sanitized Cypher:', generatedCypher);

      // Basic validation; fallback if missing expected RETURN
      if (!/RETURN\s+\w+/i.test(generatedCypher)) {
        generatedCypher = 'MATCH (p:Person {name: $name}) OPTIONAL MATCH (p)-[r]-(o) RETURN p, r, o LIMIT 200';
      }
      session = driver.session();
      const startQuery = Date.now();
      const result = await session.run(generatedCypher, { name: target });
      console.log('[TOOL / Person Lookup GPT] Query time:', Date.now() - startQuery, 'ms');

      if (result.records.length === 0) {
        return { text: "My memory is failing me because I can't recall what you mentioned." };
      }

      // Extract person node (first record's p) and relationships
      interface GraphNodeLike {
        identity?: { toString(): string };
        properties?: Record<string, unknown>;
        labels?: string[];
      }
      let personNode: GraphNodeLike | null = null;
      const relationships: Array<{
        type: string;
        direction: 'OUT' | 'IN';
        otherLabel: string;
        otherName?: string;
        otherEmail?: string;
        properties: Record<string, unknown>;
      }> = [];

      for (const record of result.records) {
        if (!personNode) personNode = record.get('p') as GraphNodeLike;
        const r = record.get('r');
        const o = record.get('o');
        if (r && o) {
          relationships.push({
            type: r.type,
            direction:
              personNode?.identity && r.start?.identity?.toString() === personNode.identity.toString() ? 'OUT' : 'IN',
            otherLabel: Array.isArray(o.labels) ? o.labels[0] : 'Unknown',
            otherName: o.properties?.name,
            otherEmail: o.properties?.email,
            properties: r.properties || {},
          });
        }
      }

      const relBreakdown: Record<string, number> = {};
      for (const rel of relationships) relBreakdown[rel.type] = (relBreakdown[rel.type] || 0) + 1;

      const relationsList = relationships.map((r) => `${r.otherName}(${r.type ?? 'unknown'})`).join(', ');

      const summary = `Profile of '${personNode?.properties?.name || target}': ${
        relationships.length
      } direct relations. Relations: ${
        relationsList || 'none'
      }. Use this information to respond accordingly to the user information needs.`;

      const totalMs = Date.now() - startTotal;
      console.log('[TOOL / Person Lookup GPT] COMPLETE in', totalMs, 'ms');
      console.log('[TOOL / Person Lookup GPT] Summary:', summary || 'Unknown');
      return {
        text: summary,
        person: {
          name: personNode?.properties?.name,
          email: personNode?.properties?.email,
          properties: personNode?.properties || {},
          relationships,
          relationsString: relationsList,
        },
        signal: 'DATA_READY_PERSON',
        timings: { totalMs },
      };
    } catch (err) {
      console.error('[TOOL / Person Lookup GPT] Error:', err);
      return { text: "My memory is failing me, I can't remember that information right now." };
    } finally {
      if (session) await session.close();
    }
  },
};
