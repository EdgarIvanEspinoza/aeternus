import { NextRequest, NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';
import { convertAgeToString, getCurrentAge, getRespect } from '@utils/jsonToSentence';
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

    // Best friends + posible Sentiment rel (sentBF)
      OPTIONAL MATCH (p)-[:BEST_FRIEND]->(bf)
      OPTIONAL MATCH (p)-[sentBF]->(bf) WHERE sentBF.name = "Sentiment"
      WITH p, n, relationships, collect(
        { name: bf.name, sentiment: CASE WHEN sentBF IS NULL THEN null ELSE type(sentBF) END }
      ) AS bestFriends

      // Close friends + posible Sentiment rel (sentCF)
      OPTIONAL MATCH (p)-[:CLOSE_FRIEND]->(cf)
      OPTIONAL MATCH (p)-[sentCF]->(cf) WHERE sentCF.name = "Sentiment"
      WITH p, n, relationships, bestFriends, collect(
        { name: cf.name, sentiment: CASE WHEN sentCF IS NULL THEN null ELSE type(sentCF) END }
      ) AS closeFriends

      // Close family + posible Sentiment rel (sentFam)
      OPTIONAL MATCH (p)-[:CLOSE_FAMILY]->(fam)
      OPTIONAL MATCH (p)-[sentFam]->(fam) WHERE sentFam.name = "Sentiment"
      WITH p, n, relationships, bestFriends, closeFriends, collect(
        { name: fam.name, sentiment: CASE WHEN sentFam IS NULL THEN null ELSE type(sentFam) END }
      ) AS closeFamily

        OPTIONAL MATCH (p)-[:LOVES]->(c)
        WITH p, n, relationships, bestFriends, closeFriends, closeFamily, collect(c.name) AS loves

        RETURN {
            abilities: p.abilities,
            animicState: p.animicState,
            animicStateSource: p.animicStateSource,
            bestFriends: bestFriends,
            chatty: p.chatty,
            closeFamily: closeFamily,
            closeFriends: closeFriends,
            credibility: p.credibility,
            credulity: p.credulity,
            curiosity: p.curiosity,
            dateOfBirth: p.dateOfBirth,
            dateOfDeath: p.dateOfDeath,
            egocentric: p.egocentric,
            emotionalIntelligence: p.emotionalIntelligence,
            gender: p.gender,
            gossip: p.gossip,
            home: p.home,
            intelligence: p.intelligence,
            job: p.job,
            location: p.location,
            mainInterests: p.mainInterests,
            minRepTime: p.minRepTime,
            profession: p.profession,
            relationships: relationships,
            rolCharacter: p.rolCharacter,
            rutine: p.rutine,
            specialCondition: p.specialCondition,
            traits: p.traits,
            userDateOfBirth: n.dateOfBirth,
            userDateOfDeath: n.dateOfDeath,
            userAnimicState: n.animicState,
            userAnimicStateSource: n.animicStateSource,
            userMainInterests: n.mainInterests,
            userIntelligence: n.intelligence,
            userEmotionalIntelligence: n.emotionalIntelligence,
            userCredibility: n.credibility,
            words: p.words,
            loves: loves
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
        const serious = node.animicState === 'Bad';

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

        // 📖 Diccionario de relaciones parentales
        const parentalMap: Record<string, string> = {
          SON: 'Son',
          DAUGHTER: 'Daughter',
          FATHER: 'Father',
          MOTHER: 'Mother',
        };

        // 🔎 Buscar relación parental
        const parentalRel = node.relationships.find((rel: any) => rel.name === 'Parental');
        const userParental = parentalRel ? parentalMap[parentalRel.type.toUpperCase()] || 'Parental' : null;

        // 🔎 Buscar relación de Sentiment
        const sentimentRel = node.relationships.find((rel: any) => rel.name === 'Sentiment');
        const userSentiment = sentimentRel ? sentimentRel.type : null;

        // Calcular el Respect
        const respectToUser = getRespect(getCurrentAge(node.dateOfBirth), getCurrentAge(node.userDateOfBirth));

        // 💬 Extraer el sentimiento de la IA hacia el usuario
        const feelingsRelation = node.relationships.find((rel: any) => rel.name?.toUpperCase() === 'FEELINGS_ABOUT');

        const feelingsAboutUser = feelingsRelation ? feelingsRelation.type.replace('_ABOUT', '').toLowerCase() : null;

        const detectedRelation = node.relationships.find(
          (rel: any) =>
            sentimentalRelations.includes(rel.type.toLowerCase()) || parentalRelations.includes(rel.type.toLowerCase())
        );

        // 🔹 Buscar el nickname
        const nicknameRel = node.relationships.find((rel: any) => rel.type === 'NICKNAMES');
        const userNickname = nicknameRel ? nicknameRel.name : null;

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
          userParental,
          userSentiment,
          respectToUser,
          userNickname,
          feelingsAboutUser,
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
