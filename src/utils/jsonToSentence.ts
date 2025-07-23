import { date } from 'zod';

type Props = {
  abilities: string;
  animic_state: string;
  date_of_birth: string;
  date_of_death?: string;
  user_date_of_birth: string;
  user_date_of_death?: string;
  health_condition: string;
  best_friends: string[];
  close_friends: string[];
  close_family: string[];
  user_animic_state: string;
  words: string;
  relationships: { type: string; name: string }[];
};

export const convertAgeToString = (
  date: {
    year: { low: number };
    month: { low: number };
    day: { low: number };
  } | null
): string => {
  if (!date) return '';

  const year = date.year.low;
  const month = String(date.month.low).padStart(2, '0');
  const day = String(date.day.low).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getCurrentAge = (dateOfBirth: string, dateOfDeath?: string): number => {
  console.log('Calculating current age with:', { dateOfBirth, dateOfDeath });
  const birthDate = new Date(dateOfBirth);
  const deathDate = dateOfDeath ? new Date(dateOfDeath) : new Date();
  let age = deathDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = deathDate.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && deathDate.getDate() < birthDate.getDate())) {
    age--;
  }
  console.log('Calculated age:', age);
  return age;
};

export const getConversationStyle = ({
  animic_state,
  relationships,
  age,
  user_age,
}: {
  animic_state: string;
  relationships: Props['relationships'];
  age: number;
  user_age: number;
}): string => {
  if (relationships?.some((r) => r.type === 'Upset' && r.name === 'Animic_Towards')) {
    return 'Tienes un estilo de conversación seco.';
  }
  if (animic_state === 'Bad') {
    return 'Tienes un estilo de conversación serio.';
  }
  const lovesSentimental = relationships?.some((r) => r.type === 'LOVES' && r.name === 'Sentiment');
  const hasCloseRelations = relationships?.some((r) =>
    ['CLOSE_FRIEND', 'BEST_FRIEND', 'CLOSE_FAMILY'].includes(r.type)
  );

  if (lovesSentimental && hasCloseRelations) return 'Estás de humor romántico y bromista.';
  if (lovesSentimental) return 'Estás de humor romántico.';
  if (hasCloseRelations) return 'Estás de humor bromista.';

  return 'Tu estilo de conversación es neutral.';
};

export const getParentalRealtionship = (relationships: Props['relationships']): string | undefined => {
  console.log('Calculating parental relationship with:', relationships);
  if (relationships?.some((r) => r.name === 'Parental')) {
    const parentalRelationship = relationships.find((r) => r.name === 'Parental');
    if (parentalRelationship) {
      return `Take into account in the style and subjects you speak that the User is your ${parentalRelationship.type}`;
    }
  }
  return undefined;
};

export const getRespect = (aiAge: number, userAge: number): number => {
  if (aiAge < 15 || userAge <= aiAge) return 0;
  return Math.min((userAge - aiAge) * 0.01, 1);
};

export const rawTraitsToPrompt = (dataArr: Props[]) => {
  if (!Array.isArray(dataArr) || dataArr.length === 0) return 'No hay información disponible.';

  const {
    abilities,
    animic_state: animicState,
    date_of_birth: dateOfBirth,
    date_of_death: dateOfDeath,
    health_condition: healthCondition,
    best_friends: bestFriends = [],
    close_friends: closeFriends = [],
    close_family: closeFamily = [],
    user_date_of_birth: userDateOfBirth,
    user_date_of_death: userDateOfDeath,
    user_animic_state: userAnimicState,
    words,
    relationships = [],
  } = dataArr[0];

  const aiAge = getCurrentAge(dateOfBirth, dateOfDeath);
  const userAge = getCurrentAge(userDateOfBirth, userDateOfDeath);
  const respectLevel = getRespect(aiAge, userAge);
  const parental = getParentalRealtionship(relationships);

  const traits: string[] = [];

  if (abilities) traits.push(`Tus habilidades son: ${abilities}.`);
  if (animicState) traits.push(`Tu estado anímico actual es: ${animicState}.`);
  if (dateOfBirth) traits.push(`Tienes ${aiAge} años.`);
  if (healthCondition) traits.push(`Tu condición de salud actual es: ${healthCondition}.`);
  if (bestFriends.length > 0) traits.push(`Tus mejores amigos son: ${bestFriends.join(', ')}.`);
  if (closeFriends.length > 0) traits.push(`Tus amigos cercanos son: ${closeFriends.join(', ')}.`);
  if (closeFamily.length > 0) traits.push(`Tus familiares cercanos son: ${closeFamily.join(', ')}.`);
  if (words) traits.push(`Este es tu estilo lingüístico, con palabras que debes usar o evitar: ${words}.`);
  if (parental) traits.push(parental);
  if (userAnimicState === 'Bad') traits.push('Se solidario durante la conversación.');

  traits.push(
    `Ten en cuenta el estilo y los temas de los que hablas ya que tienes ${aiAge} años y el usuario tiene ${userAge} años.`
  );
  if (respectLevel > 0) {
    traits.push(
      `Respetas al usuario con un nivel de ${respectLevel.toFixed(2)} (de 0 a 1) basado en la diferencia de edad.`
    );
  }

  return traits.join(' ');
};
