import driver from '@lib/neo4j/driver';

export async function getExampleNode() {
  const session = driver.session();
  try {
    const result = await session.run("MATCH (p:Person{name: 'Jacques'}) RETURN properties(p) AS props");

    if (result.records.length === 0) {
      throw new Error('No se encontró el nodo ejemplo "Jacques".');
    }

    return JSON.stringify(result.records[0].get('props'));
  } catch (error) {
    console.error('Error en getExampleNode:', error);
    throw error;
  } finally {
    await session.close();
  }
}
