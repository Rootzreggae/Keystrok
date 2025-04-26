#!/bin/bash

echo "Verifying repository configuration..."

# Check if git is initialized
if [ ! -d .git ]; then
  echo "❌ Git repository not initialized"
  exit 1
else
  echo "✅ Git repository initialized"
fi

# Check remote origin
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ $? -ne 0 ]; then
  echo "❌ Remote 'origin' not configured"
  exit 1
else
  echo "✅ Remote 'origin' configured: $REMOTE_URL"
  
  # Check if it's the correct URL
  if [ "$REMOTE_URL" != "https://github.com/Rootzreggae/Keystrok-app.git" ]; then
    echo "❌ Remote URL is incorrect. Expected: https://github.com/Rootzreggae/Keystrok-app.git"
    echo "Run './update-repo.sh' to fix this issue."
    exit 1
  else
    echo "✅ Remote URL is correct"
  fi
fi

echo "Repository configuration verified successfully!"
