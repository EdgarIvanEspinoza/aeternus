import { Avatar, Button, Link } from '@heroui/react';

export const UserSection = ({ user }: { user: any }) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <p className="text-base font-medium">{user.name}</p>
      <Avatar isBordered src={user.picture || 'https://www.gravatar.com/avatar?d=mp'} alt={user.name} size="sm" />
      <Link href="/api/auth/logout">
        <Button variant="light" size="sm" className="text-purple-500">
          Logout
        </Button>
      </Link>
    </div>
  );
};
