# Alpha Test Access Control

This document explains how to manage access to the alpha test version of the application.

## How It Works

The application implements an access control system that restricts chat access to a pre-approved list of email addresses. This is useful for alpha/beta testing phases when you want to limit who can access your application.

Key components:

1. **Email Allowlist**: A list of authorized email addresses stored in `src/config/alpha-access.ts`
2. **Access Check**: Integrated within the chat page to verify user permissions
3. **Auth0 Integration**: Works with your existing Auth0 authentication
4. **Management Tools**: Utilities to manage the access list

## Adding Users to the Alpha Test

### Method 1: Edit the configuration file directly

1. Open `src/config/alpha-access.ts`
2. Add the email address to the `ALLOWED_EMAILS` array:
   ```typescript
   export const ALLOWED_EMAILS: string[] = [
     'user1@example.com',
     'user2@example.com',
     // Add new emails here
     'newuser@example.com',
   ];
   ```

### Method 2: Use the management script

You can use the included management script to add, remove, or list allowed emails:

```bash
# Add a single email
node scripts/manage-access.mjs add user@example.com

# Remove an email
node scripts/manage-access.mjs remove user@example.com

# Import multiple emails from a text file (one email per line)
node scripts/manage-access.mjs import ./emails.txt

# List all currently allowed emails
node scripts/manage-access.mjs list
```

## How Users Experience It

1. Users first log in through Auth0 as usual
2. They're redirected to the chat page
3. If their email is on the allowed list, they can access the chat
4. If not, they see an "Unauthorized" message explaining the alpha test access restriction
5. From there, they can return to the home page

## Removing Access Control

When you're ready to open access to all users:

1. Open the chat page component (`src/app/chat/page.tsx`)
2. Remove or disable the `isAllowed` check
3. Delete the access control files if no longer needed

## Troubleshooting

If users report access issues:

1. Check that their exact email address is in the allowed list
2. Remember that email matching is case-insensitive
3. Try logging in with their account to replicate the issue
4. Check browser console for any errors
