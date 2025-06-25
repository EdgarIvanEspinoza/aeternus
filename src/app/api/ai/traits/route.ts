import { NextRequest, NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';
import { convertAgeToString } from '@utils/jsonToSentence';

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = driver.session();
  const activeAIName = req.nextUrl.searchParams.get('name') || 'Lequi';
  console.log(`[AI / Traits] Fetching traits for AI: ${activeAIName}`);
  const activeUserName = req.nextUrl.searchParams.get('user') || 'Jacques';
  console.log(activeUserName);
  try {
    const result = await session.run(`/*cypher*/
        MATCH (p:Person {name: '${activeAIName}'})
        MATCH (n:Person {name: '${activeUserName}'})

        OPTIONAL MATCH (p)-[r]->(n)
        WITH p, n, collect(r) AS relationships

        OPTIONAL MATCH (p)-[:Best_Friend]->(a)
        WITH p, n, relationships, collect(a.name) AS bestFriends

        OPTIONAL MATCH (p)-[:Close_Friend]->(b)
        WITH p, n, relationships, bestFriends, collect(b.name) AS closeFriends

        OPTIONAL MATCH (p)-[:Close_Family]->(c)
        WITH p, n, relationships, bestFriends, closeFriends, collect(c.name) AS closeFamily


        RETURN {
            abilities: p.Abilities,
            animic_state: p.animic_state,
            date_of_birth: p.date_of_birth,
            date_of_death: p.date_of_death,
            health_condition: p.special_condition,
            best_friends: bestFriends,
            close_friends: closeFriends,
            close_family: closeFamily,
            words: p.Words,
            relationships: relationships,
            traits: p.Traits,
            rol_caracteristics: p.Rol_Character,
            user_date_of_birth: n.date_of_birth,
            user_date_of_death: n.date_of_death
        } AS activeAIProfile
      `);

    const traits = result.records.map((record) => {
      const node = record.get('activeAIProfile');

      node.relationships = node.relationships.map((r: { type: string; properties: { name: string } }) => {
        return {
          type: r.type,
          name: r.properties.name,
        };
      });

      node.date_of_birth = convertAgeToString(node.date_of_birth);

      node.date_of_death = node.date_of_death ? convertAgeToString(node.date_of_death) : undefined;

      node.user_date_of_birth = convertAgeToString(node.user_date_of_birth);

      node.user_date_of_death = node.user_date_of_death ? convertAgeToString(node.user_date_of_death) : undefined;

      console.log('[AI / Traits] Fetched traits:', node);

      return node;
    });

    return NextResponse.json({ traits });
  } catch (error) {
    console.error('[AI / Traits] Error fetching traits:', error);
    return NextResponse.json({ error: 'Failed to fetch traits' }, { status: 500 });
  } finally {
    await session.close();
  }
}
