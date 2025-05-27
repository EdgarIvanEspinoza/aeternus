import driver from '@lib/neo4j/driver';

export async function checkIfUserExists(user_name: string): Promise<boolean> {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (p:Person {name: $name}) RETURN count(p) > 0 AS exists', {
      name: user_name,
    });

    if (result.records.length === 0) {
      return false;
    }

    return result.records[0].get('exists');
  } catch (error) {
    console.error('Error en checkIfUserExists:', error);
    throw error;
  } finally {
    await session.close();
  }
}
