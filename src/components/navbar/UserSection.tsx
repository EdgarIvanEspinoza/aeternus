import { Avatar } from '@heroui/react';

export const UserSection = ({ user }: { user: any }) => {
  if (!user) return null;

  return (
    <Avatar
      isBordered
      as="button"
      color="success"
      src={user.picture || 'https://www.gravatar.com/avatar?d=mp'}
      alt={user.name}
      size="sm"
    />
  );
};
