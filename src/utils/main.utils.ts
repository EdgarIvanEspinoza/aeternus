const getNameFromUser = (user: any): string => {
  return user?.given_name ? user.given_name : user?.name;
};

export { getNameFromUser };
