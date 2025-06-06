const getNameFromUser = (user: any): string => {
  return user?.given_name ? user.given_name : user?.name;
};

const checkUserIsAdmin = (email: string): boolean => {
  if (email === 'edgarivanespinoza@gmail.com' || email === 'jacquesbenlazar2@gmail.com') return true;
  return false;
};

export { checkUserIsAdmin, getNameFromUser };
