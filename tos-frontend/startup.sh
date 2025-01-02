#!/bin/sh

# Navigate to the application directory
cd /usr/src/app

# Ensure all dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the project for production
echo "Building the project..."
npm run build

# Serve the production build
echo "Starting production server..."
npx serve -s dist -l 5173
