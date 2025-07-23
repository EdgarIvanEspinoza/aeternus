import { NextRequest, NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';
import { convertAgeToString } from '@utils/jsonToSentence';
import { toNumber } from '@utils/main.utils';

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

        OPTIONAL MATCH (p)-[:BEST_FRIEND]->(a)
        WITH p, n, relationships, collect(a.name) AS bestFriends

        OPTIONAL MATCH (p)-[:CLOSE_FRIEND]->(b)
        WITH p, n, relationships, bestFriends, collect(b.name) AS closeFriends

        OPTIONAL MATCH (p)-[:CLOSE_FAMILY]->(c)
        WITH p, n, relationships, bestFriends, closeFriends, collect(c.name) AS closeFamily


        RETURN {
            abilities: p.ability,
            dateOfBirth: p.dateOfBirth,
            dateOfDeath: p.dateOfDeath,
            healthCondition: p.specialCondition,
            traits: p.traits,
            profession: p.profession,
            job: p.job,
            home: p.home,
            words: p.words,
            rolCharacter: p.rolCharacter,
            chatty: p.chatty,
            egocentric: p.egocentric,
            curious: p.curious,
            emotionalIntelligence: p.emotionalIntelligence,
            intelligence: p.intelligence,
            gossip: p.gossip,
            minRepTime: p.minRepTime,
            rutine: p.rutine,
            animicState: p.animicState,
            animicStateSource: p.animicStateSource,
            mainInterests: p.mainInterests,
            credibility: p.credibility,
            credulity: p.credulity,
            location: p.location,
            userDateOfBirth: n.dateOfBirth,
            userDateOfDeath: n.dateOfDeath,
            bestFriends: bestFriends,
            closeFriends: closeFriends,
            closeFamily: closeFamily,
            relationships: relationships
        } AS activeAIProfile
      `);

    const traits = result.records.map((record) => {
      try {
        const node = record.get('activeAIProfile');

        node.relationships = node.relationships.map((r: { type: string; properties: { name: string } }) => {
          return {
            type: r.type,
            name: r.properties.name,
          };
        });

        // 🎯 Calcular romantic
        const romanticTypes = ['love', 'wife', 'husband', 'bride', 'groom', 'girlfriend', 'boyfriend', 'crush'];
        const jokingTypes = ['closeFamily', 'closeFriends', 'bestFriends'];
        const hasRelationship = (types: string[]) =>
          node.relationships.some((rel: any) => types.includes(rel.type.toLowerCase()));

        const romantic = hasRelationship(romanticTypes);
        const joking = hasRelationship(jokingTypes);

        // 😐 Calcular serious
        const serious = node.animicState === 'bad' || node.animicStateSource === 'bad';

        // 😤 Calcular dry
        const dry = node.relationships.some((rel: any) => rel.type === 'ANGRY_ABOUT') || node.rutine === 'hurry';

        // ⏳ Calcular startingCredibility
        const lastInteractionDate = new Date('2025-07-01'); // <- TODO: reemplazar con tu fecha real
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24));
        const baseCredibility = toNumber(node.credibility) || 0;

        const startingCredibility = baseCredibility + (diffDays <= 20 ? diffDays * 0.01 : 0.2 + (diffDays - 20) * 0.01);

        // 🧠 perceivedIntelligence
        const perceivedIntelligence = parseFloat(
          (toNumber(node.intelligence ?? 0) - toNumber(node.user_intelligence ?? 0)).toFixed(2)
        );
        // 📅 Formatear fechas
        node.dateOfBirth = convertAgeToString(node.dateOfBirth);
        node.dateOfDeath = node.dateOfDeath ? convertAgeToString(node.dateOfDeath) : undefined;
        node.userDateOfBirth = convertAgeToString(node.userDateOfBirth);
        node.userDateOfDeath = node.userDateOfDeath ? convertAgeToString(node.userDateOfDeath) : undefined;

        // 💖 Clasificación relacional
        const sentimentalRelations = ['girlfriend', 'boyfriend', 'crush'];
        const parentalRelations = ['wife', 'husband', 'bride', 'groom', 'love'];

        const detectedRelation = node.relationships.find(
          (rel: any) =>
            sentimentalRelations.includes(rel.type.toLowerCase()) || parentalRelations.includes(rel.type.toLowerCase())
        );

        let relationshipClassification = null;
        if (detectedRelation) {
          if (sentimentalRelations.includes(detectedRelation.type.toLowerCase())) {
            relationshipClassification = 'Sentimental';
          } else if (parentalRelations.includes(detectedRelation.type.toLowerCase())) {
            relationshipClassification = 'Parental';
          }
        }

        // ✅ Agregar resultados
        node.stateCalculation = {
          romantic,
          joking,
          serious,
          dry,
          startingCredibility: parseFloat(startingCredibility.toFixed(2)),
          perceivedIntelligence,
          relationshipClassification,
        };

        console.log('[AI / Traits] Fetched traits:', node);

        return node;
      } catch (err) {
        console.error('Error procesando record:', err);
        throw err;
      }
    });

    return NextResponse.json({ traits });
  } catch (error) {
    console.error('[AI / Traits] Error fetching traits:', error);
    return NextResponse.json({ error: 'Failed to fetch traits' }, { status: 500 });
  } finally {
    await session.close();
  }
}
