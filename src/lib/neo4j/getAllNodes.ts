import driver from '@lib/neo4j/driver';

export async function getAllNodes() {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (n) RETURN n');

    if (result.records.length === 0) {
      throw new Error('No hay nodos.');
    }

    return JSON.stringify(result);
  } catch (error) {
    console.error('Error en getExampleNode:', error);
    throw error;
  } finally {
    await session.close();
  }
}
