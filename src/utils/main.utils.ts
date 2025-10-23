const getNameFromUser = (user: any): string => {
  return user?.given_name ? user.given_name : user?.name;
};

const getNameAndFamilyFromUser = (user: any): string => {
  return user?.given_name ? `${user.given_name} ${user.family_name}` : user?.name;
};

import { isAdminUser } from '@config/admin-access';

const checkUserIsAdmin = (email: string): boolean => {
  return isAdminUser(email);
};

type IntLow = { low: number };
type IntWithMethod = { toNumber: () => number };

const toNumber = (val: unknown): number => {
  if (typeof val === 'bigint') return Number(val);
  if (typeof val === 'number') return val;
  if (val && typeof val === 'object') {
    if ('low' in (val as object) && typeof (val as IntLow).low === 'number') {
      return (val as IntLow).low;
    }
    if ('toNumber' in (val as object) && typeof (val as IntWithMethod).toNumber === 'function') {
      return (val as IntWithMethod).toNumber();
    }
  }
  const coerced = Number(String(val)); // final fallback using string coercion
  return isNaN(coerced) ? 0 : coerced;
};

type RespectLevel = 'low' | 'medium' | 'high';

interface RespectRule {
  condition: (aiAge: number, userAge: number) => boolean;
  respect: RespectLevel;
}

const respectRules: RespectRule[] = [
  {
    condition: (ai, user) => Math.abs(ai - user) <= 5,
    respect: 'high', // casi contemporáneos → más naturalidad, más cercanía
  },
  {
    condition: (ai, user) => ai > user,
    respect: 'medium', // IA mayor que el user → tono más mentor / protector
  },
  {
    condition: (ai, user) => ai < user,
    respect: 'low', // IA más joven → tono más deferente, aprendiz
  },
];

function getRespect(aiAge: number, userAge: number): RespectLevel {
  const rule = respectRules.find((r) => r.condition(aiAge, userAge));
  return rule ? rule.respect : 'medium';
}

export { checkUserIsAdmin, getNameFromUser, toNumber, getRespect, getNameAndFamilyFromUser };
