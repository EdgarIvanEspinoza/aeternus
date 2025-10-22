#!/usr/bin/env node

// Alpha Test Access Control Management Script

import { addEmail, removeEmail, importEmailsFromFile, listAllowedEmails } from '../utils/access-manager.js';
import { argv, exit } from 'process';

// Parse command line arguments
const args = argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'add':
        if (!args[1]) {
          console.error('Error: No email address provided');
          showUsage();
          process.exit(1);
        }
        await addEmail(args[1]);
        break;
        
      case 'remove':
        if (!args[1]) {
          console.error('Error: No email address provided');
          showUsage();
          process.exit(1);
        }
        await removeEmail(args[1]);
        break;
        
      case 'import':
        if (!args[1]) {
          console.error('Error: No file path provided');
          showUsage();
          process.exit(1);
        }
        await importEmailsFromFile(args[1]);
        break;
        
      case 'list':
        listAllowedEmails();
        break;
        
      default:
        showUsage();
        break;
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function showUsage() {
  console.log(`
Alpha Test Access Control Management

Usage:
  node scripts/manage-access.js add <email>     - Add an email to the allowed list
  node scripts/manage-access.js remove <email>  - Remove an email from the allowed list
  node scripts/manage-access.js import <file>   - Import emails from a text file (one per line)
  node scripts/manage-access.js list            - Show all currently allowed emails
`);
}

main();