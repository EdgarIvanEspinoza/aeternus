import { NextRequest, NextResponse } from 'next/server';
import driver from '@lib/neo4j/driver';

export async function POST(req: NextRequest) {
  const session = driver.session();

  try {
    const body = await req.json();
    const { conversation, userName } = body;

    if (!Array.isArray(conversation) || typeof userName !== 'string') {
      return NextResponse.json({ error: 'Invalid body format' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const logName = timestamp;

    const cypher = `
      MERGE (ai:Person { name: "Lequi" })
      MERGE (user:Person { name: $userName })
      CREATE (log:Conversation_Log {
        name: $logName,
        conversation: $conversation,
        participants: [$userName, "Lequi"]
      })
      MERGE (user)-[:USER_CREATION]->(log)
      MERGE (ai)-[:AI_CREATION]->(log)
    `;

    await session.run(cypher, {
      userName,
      logName,
      timestamp,
      conversation,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Neo4j save error:', error);
    return NextResponse.json({ error: 'Neo4j error' }, { status: 500 });
  } finally {
    await session.close();
  }
}
