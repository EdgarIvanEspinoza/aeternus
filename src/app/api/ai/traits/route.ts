import { NextRequest, NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = driver.session();
  const activeAIName = req.nextUrl.searchParams.get('name') || 'Lequi';
  console.log(`[AI / Traits] Fetching traits for AI: ${activeAIName}`);
  try {
    const result = await session.run(`/*cypher*/
        MATCH (p:Person {name: '${activeAIName}'})

        OPTIONAL MATCH (p)-[:Best_Friend]->(a)
        WITH p, collect(a.name) AS bestFriends

        OPTIONAL MATCH (p)-[:Close_Friend]->(b)
        WITH p, bestFriends, collect(b.name) AS closeFriends

        OPTIONAL MATCH (p)-[:Close_Family]->(c)
        WITH p, bestFriends, closeFriends, collect(c.name) AS closeFamily 

        RETURN {
            abilities: p.abilities,
            animic_state: p.animic_state,
            age: p.age,
            health_condition: p.health_condition,
            best_friends: bestFriends,
            close_friends: closeFriends,
            close_family: closeFamily
        } AS activeAIProfile
      `);

    const traits = result.records.map((record) => {
      const node = record.get('activeAIProfile');
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
