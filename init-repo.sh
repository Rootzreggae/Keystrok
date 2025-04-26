#!/bin/bash

# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/Rootzreggae/Keystrok-app.git

# Push to main branch
git push -u origin main

echo "Repository initialized and pushed to GitHub!"
