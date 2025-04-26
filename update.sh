#!/bin/bash

# Stage all changes
git add .

# Commit changes with provided message or default
if [ -z "$1" ]
then
  git commit -m "Update $(date)"
else
  git commit -m "$1"
fi

# Push directly to main branch
git push -u origin main

echo "Changes pushed directly to main branch!"
