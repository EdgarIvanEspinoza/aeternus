type Props = {
  abilities: string;
  animic_state: string;
  age: number;
  health_condition: string;
  best_friends: string[];
  close_friends: string[];
  close_family: string[];
};

function rawTraitsToPrompt(dataArr: Props) {
  if (!Array.isArray(dataArr) || dataArr.length === 0) return 'No information available';
  const {
    abilities,
    animic_state: animicState,
    age,
    health_condition: healthCondition,
    best_friends: bestFriends,
    close_friends: closeFriends,
    close_family: closeFamily,
  } = dataArr[0];

  console.log('rawTraitsToPrompt dataArr:', dataArr);

  return [
    abilities ? `Abilities: ${abilities}` : '',
    animicState ? `Animic state: ${animicState}` : '',
    age ? `Age: ${age} years` : '',
    healthCondition ? `Health condition: ${healthCondition}` : '',
    bestFriends.length > 0 ? `Best friends: ${bestFriends.join(', ')}` : '',
    closeFriends.length > 0 ? `Close friends: ${closeFriends.join(', ')}` : '',
    closeFamily.length > 0 ? `Close family: ${closeFamily.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export default rawTraitsToPrompt;
