#!/bin/bash

# Script to update the remote repository URL

# Check if git is initialized
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
fi

# Check if remote origin exists
if git remote | grep -q "^origin$"; then
  echo "Removing existing origin..."
  git remote remove origin
fi

# Add new remote origin
echo "Adding new remote origin: https://github.com/Rootzreggae/Keystrok-app.git"
git remote add origin https://github.com/Rootzreggae/Keystrok-app.git

echo "Remote repository updated successfully!"
echo "Use 'git push -u origin main' for your first push to the new repository."
