#!/bin/bash

echo "====================================="
echo "CareerBridge - Full Project Setup"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"
echo "Node version: $(node -v)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found in backend"
    echo "Please create a .env file with your configuration:"
    echo "  - PORT=5000"
    echo "  - MONGODB_URI=your_mongodb_uri"
    echo "  - JWT_SECRET=your_secret"
    echo "  - CORS_ORIGIN=http://localhost:5173"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""

# Go back to root
cd ..

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found in frontend"
    echo "Please create a .env file with your configuration:"
    echo "  - VITE_API_URL=http://localhost:5000/api"
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""

cd ..

echo "====================================="
echo "✅ Setup Complete!"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Configure .env files (backend and frontend)"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "Documentation: See SETUP_GUIDE.md"
