import { z } from 'zod';
import { Tool } from 'ai';
import driver from '../neo4j/driver';

// Deterministic JS-only person lookup tool. Avoids calling LLMs so it can be
// invoked repeatedly without causing nested LLM execution or crashes.

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
    'Fetch full profile of a single person (properties + direct relationships). Deterministic and safe for repeated calls.',
  parameters: z.object({ query: z.string().describe('Name or email of the person to inspect') }),
  async execute({ query }) {
    const startTotal = Date.now();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let session: any = null;
    const target = normalizePerson(query);
    console.log(`[TOOL / PersonLookup] START target='${target}' raw='${query}'`);

    if (target === 'Lequi') return { text: 'Skipped self lookup (assistant = Lequi).', person: null };

    try {
      session = driver.session();

      const cypher = `/*cypher*/
        MATCH (p:Person {name: $name})
        OPTIONAL MATCH (p)-[r]-(o)
        RETURN p, collect(r) AS rels, collect(o) AS others LIMIT 1
      `;

      const res = await session.run(cypher, { name: target });
      if (!res || res.records.length === 0) return { text: `No data found for ${target}`, person: null };

      const rec = res.records[0];
      const p = rec.get('p');
      const rels = Array.isArray(rec.get('rels')) ? rec.get('rels') : [];
      const others = Array.isArray(rec.get('others')) ? rec.get('others') : [];

      // Build raw relationship instances first
      const rawRels: Array<{
        type: string;
        direction: 'OUT' | 'IN';
        otherName?: string;
      }> = [];

      for (let i = 0; i < rels.length; i++) {
        const r = rels[i];
        const o = others[i];
        if (!r || !o) continue;
        const otherName = o.properties?.name;
        const direction =
          r.start && p && r.start.identity && p.identity && r.start.identity.toString() === p.identity.toString()
            ? 'OUT'
            : 'IN';
        rawRels.push({ type: r.type || 'UNKNOWN', direction, otherName });
      }

      // Group by other node name. Skip relations without a name.
      const grouped = new Map<
        string,
        Array<{
          type: string;
          direction: 'OUT' | 'IN';
        }>
      >();

      for (const rr of rawRels) {
        if (!rr.otherName) continue; // skip unnamed nodes
        const list = grouped.get(rr.otherName) || [];
        list.push({ type: rr.type, direction: rr.direction });
        grouped.set(rr.otherName, list);
      }

      // Convert grouped map into the unified relationships shape the user requested:
      // [{ name: string, relations: [{type,direction}, ...] }, ...]
      const relationships = Array.from(grouped.entries()).map(([name, rels]) => ({
        name,
        relations: rels,
      }));

      // Breakdown by type across all relations (for the summary)
      const relBreakdown: Record<string, number> = {};
      for (const relList of relationships) {
        for (const r of relList.relations) relBreakdown[r.type] = (relBreakdown[r.type] || 0) + 1;
      }

      const topTypes = Object.entries(relBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([t, c]) => `${t}(${c})`)
        .join(', ');

      // relationsString: 'Name: TYPE(OUT), TYPE2(IN); Other: ...'
      const relationsList = relationships
        .map((r) => `${r.name}: ${r.relations.map((x) => `${x.type}(${x.direction})`).join(', ')}`)
        .join('; ');

      const summary = `Profile of '${p?.properties?.name ?? target}': ${
        relationships.length
      } direct relations. Main types: ${topTypes || 'none'}. Relations: ${relationsList || 'none'}.`;

      const totalMs = Date.now() - startTotal;
      console.log('[TOOL / PersonLookup] COMPLETE in', totalMs, 'ms');
      const resultObj = {
        text: summary,
        person: {
          name: p?.properties?.name,
          // only expose the name property on linked nodes as requested
          properties: p?.properties || {},
          relationships,
          relationsString: relationsList,
        },
        signal: 'DATA_READY_PERSON',
        timings: { totalMs },
      };
      console.log('[TOOL / PersonLookup] Result:', JSON.stringify(resultObj, null, 2));
      return resultObj;
    } catch (err) {
      console.error('[TOOL / PersonLookup] Error:', err);
      return { text: 'My memory is failing me right now.' };
    } finally {
      if (session) await session.close();
    }
  },
};
