import { date } from 'zod';

type Props = {
  abilities: string;
  animic_state: string;
  date_of_birth: string;
  date_of_death?: string;
  health_condition: string;
  best_friends: string[];
  close_friends: string[];
  close_family: string[];
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
  return date ? `${date.year.low}-${date.month.low}-${date.day.low}` : '';
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
  console.log('Calculating conversation style with:', { animic_state, relationships, age, user_age });
  const response = [];
  if (relationships?.some((r) => r.type === 'Upset' && r.name === 'Animic_Towards')) {
    return 'Dry';
  }
  if (animic_state === 'Bad') {
    return 'Serious';
  }
  if (relationships?.some((r) => r.type === 'Loves' && r.name === 'Sentimental')) {
    if (
      relationships?.some((r) => r.type === 'Close_Friend' || r.type === 'Best_Friend' || r.type === 'CLOSE_FAMILY')
    ) {
      return 'You have a Joking & Romantic mood';
    }
    return 'You are in a Romantic mood';
  }
  if (relationships?.some((r) => r.type === 'Close_Friend' || r.type === 'Best_Friend' || r.type === 'CLOSE_FAMILY')) {
    if (relationships?.some((r) => r.type === 'Loves' && r.name === 'Sentimental')) {
      return 'You have a Joking & Romantic mood';
    }
    return 'You have a Joking mood';
  }
  return 'Neutral';
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

export const rawTraitsToPrompt = (dataArr: Props) => {
  if (!Array.isArray(dataArr) || dataArr.length === 0) return 'No information available';
  console.log('Data array:', dataArr);
  const {
    abilities,
    animic_state: animicState,
    date_of_birth: dateOfBirth,
    date_of_death: dateOfDeath,
    health_condition: healthCondition,
    best_friends: bestFriends,
    close_friends: closeFriends,
    close_family: closeFamily,
    user_date_of_birth: userDateOfBirth,
    user_date_of_death: userDateOfDeath,
    words,
    relationships,
  } = dataArr[0];

  return [
    abilities ? `your abilities are: ${abilities},` : '',
    animicState ? `your current animic state is ${animicState},` : '',
    dateOfBirth ? `your age is ${getCurrentAge(dateOfBirth, dateOfDeath)} years,` : '',
    healthCondition ? `your current health condition is: ${healthCondition},` : '',
    bestFriends.length > 0 ? `your best friends are: ${bestFriends.join(', ')},` : '',
    closeFriends.length > 0 ? `your close friends are: ${closeFriends.join(', ')},` : '',
    closeFamily.length > 0 ? `your close family are: ${closeFamily.join(', ')}` : '',
    words ? `. This is your language style with the words to use or not use in a conversation: ${words}.` : '',
    relationships?.length ? `${getParentalRealtionship(relationships)}.` : '',
    dateOfBirth
      ? `Take into account, in the style and subjects you speak, that you are ${getCurrentAge(
          dateOfBirth,
          dateOfDeath
        )} years old ${
          userDateOfBirth ? `and the User is ${getCurrentAge(userDateOfBirth, userDateOfDeath)} years old.` : '.'
        }`
      : '',
  ]

    .filter(Boolean)
    .join(' ');
};
