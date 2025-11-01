// Configuration file for alpha test access control
// Add all allowed email addresses to this array

export const ALLOWED_EMAILS: string[] = [
  // Add your allowed emails here
  'edgarivanespinoza@gmail.com',
  'jacquesbenlazar2@gmail.com',
  'evyeichler@gmail.com',
  'henry@agricorpusa.com',
  'janywinter@yahoo.com',
  'adam.incorrecto@gmail.com',
  'lazarsw1@gmail.com',
  'gabrielle.eichler@gmail.com',
  'eichlerdalya@gmail.com',
  'jessysadovnik@gmail.com',
  'susana.dibos@gmail.com',
  'zmandel@gmail.com',
  'elito.feldman@gmail.com',
  'oscarbarton@yahoo.com',
  'bsalamon@elrosado.com',
  'joannacaraballo93@gmail.com',
  'daeduardo98@gmail.com',
  'alejandrodearmas990@gmail.com',
  'rl.carlos@gmail.com',
  'luissloreto@gmail.com',
  'jn.fuentest@gmail.com',
  'joanaherrera3@gmail.com',
  'lzh015@gmail.com',
  'jwinter@wishtlatam.com',
  'ivan.espinoza@native-instruments.com',
  'olbartong@gmail.com',
  // Add more emails as needed
];

// Helper function to check if a user is allowed access
export const isUserAllowed = (email: string | null | undefined): boolean => {
  if (!email) return false;

  return ALLOWED_EMAILS.includes(email.toLowerCase());
};
