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

export { checkUserIsAdmin, getNameFromUser, toNumber, getNameAndFamilyFromUser };
