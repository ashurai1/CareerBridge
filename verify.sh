#!/bin/bash

echo "====================================="
echo "CareerBridge - Project Verification"
echo "====================================="
echo ""

# Check backend structure
echo "📦 Checking Backend Structure..."
backend_files=(
    "backend/models/Notification.js"
    "backend/controllers/notificationController.js"
    "backend/controllers/jobController.js"
    "backend/controllers/applicationController.js"
    "backend/routes/notificationRoutes.js"
    "backend/routes/jobRoutes.js"
    "backend/routes/applicationRoutes.js"
    "backend/server.js"
    "backend/package.json"
)

for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
    fi
done

echo ""
echo "📱 Checking Frontend Structure..."
frontend_files=(
    "frontend/src/pages/JobsNew.jsx"
    "frontend/src/pages/JobsNew.css"
    "frontend/src/pages/JobDetail.jsx"
    "frontend/src/pages/JobDetail.css"
    "frontend/src/components/Notifications.jsx"
    "frontend/src/components/Notifications.css"
    "frontend/src/components/JobManagement.jsx"
    "frontend/src/components/JobManagement.css"
    "frontend/src/services/api.js"
    "frontend/src/App.jsx"
    "frontend/src/components/Dashboard/Sidebar.jsx"
)

for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
    fi
done

echo ""
echo "📚 Checking Documentation..."
doc_files=(
    "SETUP_GUIDE.md"
    "PROJECT_COMPLETION_SUMMARY.md"
    "setup.sh"
)

for file in "${doc_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
    fi
done

echo ""
echo "✅ Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env files with your configuration"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Visit: http://localhost:5173"
