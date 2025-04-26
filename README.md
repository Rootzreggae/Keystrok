# Keystrok Dashboard

A comprehensive dashboard for API key management and security monitoring.

## Repository

This project is hosted at: https://github.com/Rootzreggae/Keystrok-app

## Deployment

This project is configured for automatic deployment when changes are pushed to the main branch.

### Initial Setup

If you're setting up the repository for the first time:

\`\`\`bash
# Make the script executable
chmod +x init-repo.sh

# Run the initialization script
./init-repo.sh
\`\`\`

### Updating Remote Repository

If you need to update the remote repository URL:

\`\`\`bash
# Make the script executable
chmod +x update-repo.sh

# Run the update script
./update-repo.sh
\`\`\`

### Regular Updates

For pushing changes to the repository:

\`\`\`bash
# Stage changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to main branch
git push -u origin main
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Supabase
- TypeScript
