// This file is intended for use by administrators to manage the alpha test access list

import { ALLOWED_EMAILS } from '../config/alpha-access';
import fs from 'fs/promises';
import path from 'path';

// Configuration file path
const configFilePath = path.resolve(process.cwd(), 'src/config/alpha-access.ts');

// Function to add a new email to the allowed list
async function addEmail(email: string) {
  // Normalize the email
  const normalizedEmail = email.trim().toLowerCase();

  // Check if the email is already in the list
  if (ALLOWED_EMAILS.includes(normalizedEmail)) {
    console.log(`Email ${normalizedEmail} is already in the allowed list.`);
    return;
  }

  // Read the current file content
  const fileContent = await fs.readFile(configFilePath, 'utf8');

  // Create the updated allowed emails array
  const updatedList = [...ALLOWED_EMAILS, normalizedEmail];

  // Format the array as a string
  const formattedList = updatedList.map((email) => `  '${email}'`).join(',\n');

  // Create the new file content
  const newContent = fileContent.replace(
    /export const ALLOWED_EMAILS: string\[\] = \[([\s\S]*?)\];/,
    `export const ALLOWED_EMAILS: string[] = [\n${formattedList}\n];`
  );

  // Write the updated content back to the file
  await fs.writeFile(configFilePath, newContent, 'utf8');

  console.log(`Added ${normalizedEmail} to the allowed email list.`);
}

// Function to remove an email from the allowed list
async function removeEmail(email: string) {
  // Normalize the email
  const normalizedEmail = email.trim().toLowerCase();

  // Check if the email is in the list
  if (!ALLOWED_EMAILS.includes(normalizedEmail)) {
    console.log(`Email ${normalizedEmail} is not in the allowed list.`);
    return;
  }

  // Read the current file content
  const fileContent = await fs.readFile(configFilePath, 'utf8');

  // Create the updated allowed emails array
  const updatedList = ALLOWED_EMAILS.filter((e) => e !== normalizedEmail);

  // Format the array as a string
  const formattedList = updatedList.map((email) => `  '${email}'`).join(',\n');

  // Create the new file content
  const newContent = fileContent.replace(
    /export const ALLOWED_EMAILS: string\[\] = \[([\s\S]*?)\];/,
    `export const ALLOWED_EMAILS: string[] = [\n${formattedList}\n];`
  );

  // Write the updated content back to the file
  await fs.writeFile(configFilePath, newContent, 'utf8');

  console.log(`Removed ${normalizedEmail} from the allowed email list.`);
}

// Function to import emails from a text file (one email per line)
async function importEmailsFromFile(filePath: string) {
  // Read the email file
  const fileContent = await fs.readFile(filePath, 'utf8');

  // Split by line and clean up emails
  const emails = fileContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.includes('@'));

  // Add each email
  for (const email of emails) {
    await addEmail(email);
  }

  console.log(`Processed ${emails.length} emails from ${filePath}`);
}

// Function to list all allowed emails
function listAllowedEmails() {
  console.log('Currently allowed email addresses:');

  if (ALLOWED_EMAILS.length === 0) {
    console.log('No emails in the allowed list.');
  } else {
    ALLOWED_EMAILS.forEach((email, index) => {
      console.log(`${index + 1}. ${email}`);
    });
  }
}

// Export functions for use in scripts
export { addEmail, removeEmail, importEmailsFromFile, listAllowedEmails };
