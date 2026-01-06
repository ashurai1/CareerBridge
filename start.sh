#!/bin/bash

# Kill any existing processes on ports 8000 and 5173
echo "🧹 Cleaning up existing processes..."
lsof -t -i:8000 | xargs kill -9 2>/dev/null
lsof -t -i:5173 | xargs kill -9 2>/dev/null
lsof -t -i:5174 | xargs kill -9 2>/dev/null
lsof -t -i:5175 | xargs kill -9 2>/dev/null
lsof -t -i:5176 | xargs kill -9 2>/dev/null

echo "✅ Ports cleared!"
echo "🚀 Starting application..."
echo ""

# Start the application
npm run dev
