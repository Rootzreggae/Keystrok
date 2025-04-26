#!/bin/bash

# Build the project
npm run build

# Create .nojekyll file to prevent Jekyll processing
touch out/.nojekyll

# Stage all changes
git add .

# Commit changes
git commit -m "Update deployment $(date)"

# Push directly to main branch
git push -u origin main

echo "Deployment complete! Changes pushed to https://github.com/Rootzreggae/Keystrok-app.git"
