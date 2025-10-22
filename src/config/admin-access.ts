// Configuration for admin access control

export const ADMIN_EMAILS: string[] = [
  'edgarivanespinoza@gmail.com',
  'jacquesbenlazar@gmail.com',
  // Add more admin emails as needed
];

// Helper function to check if a user is an admin
export const isAdminUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};