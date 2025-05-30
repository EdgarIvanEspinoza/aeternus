import { z } from 'zod';
import { generateText, Tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { checkIfUserExists } from '../neo4j/checkIfUserExists';
import { getExampleNode } from '../neo4j/getExampleNode';
import driver from '../neo4j/driver';

export const cypherBuilderTool: Tool = {
  description:
    'Construye una consulta Cypher para crear o actualizar nodos en Neo4j, usando la estructura del nodo ejemplo Jacques  tu intencion es llenar de informacion el neo4j para obtener mucha información del USUARIO.',
  parameters: z.object({
    user_name: z.string().describe('El nombre a que te refieres a mi'),
    user_input: z.string().describe('Texto ingresado por el usuario.'),
  }),
  async execute({ user_name, user_input }) {
    let session;
    console.log('Ejecutando cypherBuilderTool con:', { user_name, user_input });
    try {
      const example_node = await getExampleNode();
      const node_exists = await checkIfUserExists(user_name);
      const prompt = `
Eres una herramienta que genera código Cypher para Neo4j tu intencion es llenar de informacion el neo4j para obtener mucha información del USUARIO.

Esto es un Nodo de ejemplo para que veas como es una estructura con sus propiedasdes, este es el nodo de Jacques (que sirve como plantilla):
${example_node}

USUARIO: ${user_name}
Input del USUARIO: "${user_input}"
¿El nodo ya existe?: ${node_exists ? 'Sí' : 'No'}
Los nodos de personas son "Person" con el nombre de el USUARIO que es ${user_name} y el input del usuario es "${user_input}".
Objetivo:
- Si el nodo NO existe, genera un Cypher CREATE con los atributos relevantes extraídos del input.
- Si el nodo SÍ existe, genera un Cypher MATCH y SET para actualizar solo las propiedades nuevas.
- Devuelve también un resumen del propósito del query y una sugerencia de conversación para seguir recolectando datos.

Para guardar fechas debes usar date y luego la fecha que queramos guardar. como por ejemplo: date("1990-04-15")


- Devuelve la resuesta en un objeto JSON con:
  {
    "cypher": "el query Cypher generado",
    "purpose": "resumen del objetivo del query",
    "reaction": "informacion faltante del usuario que deberia preguntarle para completar el nodo"')"
  }

No incluyas explicaciones adicionales ni comentarios en el Cypher.
y que no sea mdx solo el JSON plano.
`;

      const { steps } = await generateText({
        model: openai.responses('gpt-4o-mini'),
        prompt,
      });

      if (!steps?.length) {
        throw new Error('No se recibieron pasos de respuesta del modelo.');
      }
      console.log('Respuesta del modelo:', steps[0].text);
      let parsed;
      try {
        parsed = JSON.parse(steps[0].text);
      } catch (jsonError) {
        console.error('Error parsing JSON response from generateText:', jsonError);
        throw new Error('Respuesta del modelo inválida, no se pudo parsear JSON.');
      }

      session = driver.session();
      await session.run(parsed.cypher);

      return { text: parsed.reaction };
    } catch (error) {
      console.error('Error en cypherBuilderTool.execute:', error);
      return {
        text: 'Estoy intentando recordar lo que me dijiste pero ando nublado y tengo problemas para entenderte.',
      };
    } finally {
      if (session) {
        await session.close();
      }
    }
  },
};
