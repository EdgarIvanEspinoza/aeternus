const getNameFromUser = (user: any): string => {
  return user?.given_name ? user.given_name : user?.name;
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

export { checkUserIsAdmin, getNameFromUser, toNumber };
