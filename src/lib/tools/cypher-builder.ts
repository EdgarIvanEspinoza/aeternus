import { z } from 'zod';
import { generateText, Tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { checkIfUserExists } from '../neo4j/checkIfUserExists';
import { getExampleNode } from '../neo4j/getExampleNode';
import driver from '../neo4j/driver';
import { notificationEmitter } from '@lib/events/notifications';

export const cypherBuilderTool: Tool = {
  description:
    'This is a tool so you can save information about the user. Lets say is a Memory storage just for you. Use it when you think is necesary to save something revelant that you might need in the future, for example any carcteristics of the user, where he lives, likes, dislikes, etc.',
  parameters: z.object({
    user_name: z.string().describe('Name of the User'),
    user_input: z.string().describe('Input of the user to create'),
  }),
  async execute({ user_name, user_input }) {
    let session;
    console.log(`[TOOL / Cypher Build]=> Parameters user_name:${user_name} user_input: ${user_input}`);
    try {
      const example_node = await getExampleNode();
      const node_exists = await checkIfUserExists(user_name);
      const prompt = `
      You are a tool to generate Cypher code for neo4j. You main objetive is to fill information in de neo4j db with the User Information.
      This is an example of another user. This is the node of Jacques, with this you have all the properties of the node wich you want to fill with the input of the user:
      Example Node of Jacques: ${example_node}
      The user is: ${user_name}
      The input of the user is: ${user_input}
      This will tell you if the node of the user exists or not: The node ${node_exists ? 'exist' : 'doesnt exist'}

      The node of people like the user is called "Person"
      
      Your main Objetive:
      -If the node doesnt exist, generate a new Cypher with CREATE and the relevant attributes that you can identify from the input of the user.
      -If the node does exist, generate a cypher with MATCH and SET to update the properties.
      -Also return the purpose to create this query and a suggestion of conversation to keep saving more information of the user.

      To save Dates if necesary, the format is with date and between parenthesis, for example: date("1990-04-15")
      Now you can return the answer in a JSON object with:
        {
        "cypher": "the generated Cypher",
        "purpose": "briefing of the purpose to create this Cypher",
        "reaction": "Missing information that you can suggest to the other AI so it can ask"
        } 

      Do not include any other suggetions o comments in the Cypher, and dont response with MDX, only in flat JSON
`;

      const { steps } = await generateText({
        model: openai.responses('gpt-4o-mini'),
        prompt,
      });

      console.log('[TOOL / Cypher Build]=> Response:', steps[0].text);

      let parsed;
      try {
        parsed = JSON.parse(steps[0].text);
      } catch (jsonError) {
        console.error('Error parsing JSON response from generateText:', jsonError);
        throw new Error('Error parsing JSON response from generateText.');
      }

      session = driver.session();
      await session.run(parsed.cypher);
      notificationEmitter.emit('notify', {
        cypher: `Cypher: ${parsed.cypher}`,
        purpose: `Purpose: ${parsed.purpose}`,
        reaction: `Suggestion: ${parsed.reaction}`,
      });
      return { text: parsed.reaction };
    } catch (error) {
      console.error('Error in cypherBuilderTool.execute:', error);
      return {
        text: 'Im trying to remeber what you just have said, but i feel blurry and confused.',
      };
    } finally {
      if (session) {
        await session.close();
      }
    }
  },
};
