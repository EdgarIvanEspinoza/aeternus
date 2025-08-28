const getNameFromUser = (user: any): string => {
  return user?.given_name ? user.given_name : user?.name;
};

const getNameAndFamilyFromUser = (user: any): string => {
  return user?.given_name ? `${user.given_name} ${user.family_name}` : user?.name;
};

const checkUserIsAdmin = (email: string): boolean => {
  if (email === 'edgarivanespinoza@gmail.com' || email === 'jacquesbenlazar2@gmail.com') return true;
  return false;
};

const toNumber = (val: any): number => {
  if (typeof val === 'bigint') return Number(val);
  if (val && typeof val === 'object' && 'low' in val) return val.low;
  return Number(val);
};

type RespectLevel = "low" | "medium" | "high";

interface RespectRule {
  condition: (aiAge: number, userAge: number) => boolean;
  respect: RespectLevel;
}

const respectRules: RespectRule[] = [
  {
    condition: (ai, user) => Math.abs(ai - user) <= 5,
    respect: "high", // casi contemporáneos → más naturalidad, más cercanía
  },
  {
    condition: (ai, user) => ai > user,
    respect: "medium", // IA mayor que el user → tono más mentor / protector
  },
  {
    condition: (ai, user) => ai < user,
    respect: "low", // IA más joven → tono más deferente, aprendiz
  },
];

function getRespect(aiAge: number, userAge: number): RespectLevel {
  const rule = respectRules.find((r) => r.condition(aiAge, userAge));
  return rule ? rule.respect : "medium";
}

export { checkUserIsAdmin, getNameFromUser, toNumber, getRespect, getNameAndFamilyFromUser };
