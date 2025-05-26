import { NextRequest, NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export async function GET(req: NextRequest) {
  const session = driver.session();

  try {
    const result = await session.run(`
        MATCH (p:Person {name:'Lequi'})

        OPTIONAL MATCH (p)-[:Personality]->(c1:Characteristics)
        WITH p, collect({name: c1.name, description: c1.Texto}) AS personality

        OPTIONAL MATCH (p)-[:Favorite]->(a:Activity)
        WITH p, personality, collect(a.name) AS favoriteActivities

        OPTIONAL MATCH (p)-[:Good_At]->(k1:Knowledge)
        WITH p, personality, favoriteActivities, collect(k1.name) AS goodAt

        OPTIONAL MATCH (p)-[:Super_At]->(k2:Knowledge)
        WITH p, personality, favoriteActivities, goodAt, collect(k2.name) AS superAt

        OPTIONAL MATCH (p)-[:Favorite]->(e:Environment)
        WITH p, personality, favoriteActivities, goodAt, superAt, collect(e.name) AS favoriteEnvironments

        OPTIONAL MATCH (p)-[:Trauma]->(m:Memory)
        WITH p, personality, favoriteActivities, goodAt, superAt, favoriteEnvironments, collect(m.name) AS traumas

        RETURN {
          basic: {
            animic_state: p.animic_state,
            date_of_birth: p.date_of_birth,
            date_of_death: p.date_of_death,
            place_of_birth: p.place_of_birth,
            religion: p.religion,
            race: p.race,
            eye_color: p.eye_color,
            hair_color: p.hair_color,
            hair_style: p.hair_style,
            height: p.height,
            weight: p.weight,
            strength: p.strength,
            reflex: p.reflex,
            flexibility: p.flexibility,
            skin: p.skin,
            special_condition: p.special_condition,
            glasses: p.glasses
          },
          history: {
            living: p.living_history,
            work: p.work_history,
            education: p.education_history,
            family: p.family_history,
            friends: p.friends_history
          },
          traits: personality,
          favoriteActivities: favoriteActivities,
          goodAt: goodAt,
          superAt: superAt,
          favoriteEnvironments: favoriteEnvironments,
          traumas: traumas
        } AS personProfile
      `);

    const traits = result.records.map((record) => {
      const node = record.get('personProfile');
      console.log('personProfile', node);
      return node;
    });

    return NextResponse.json({ traits });
  } catch (error) {
    console.error('Error fetching traits:', error);
    return NextResponse.json({ error: 'Failed to fetch traits' }, { status: 500 });
  } finally {
    await session.close();
  }
}
