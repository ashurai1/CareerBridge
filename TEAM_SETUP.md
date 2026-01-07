# 👥 Team Setup Guide - CareerBridge

Complete guide for team members to setup the project locally and connect to shared database.

---

## 🎯 Quick Setup (5 Minutes)

```bash
# 1. Clone
git clone https://github.com/ashurai1/CareerBridge.git
cd CareerBridge

# 2. Install
npm install

# 3. Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Get credentials from team lead and update .env files

# 5. Start
npm run dev
```

**Done!** Open http://localhost:5173

---

## 🗄️ Database Access (MongoDB Atlas)

### Team Lead Will Provide:

1. **MongoDB Connection String**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careerbridge
```

2. **JWT Secret**:
```env
JWT_SECRET=your_shared_secret
```

3. **OAuth Credentials** (if using social login):
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### How Team Members Connect:

**Option 1: Shared Database (Recommended)**
- Everyone uses same MongoDB Atlas database
- Team lead shares connection string
- All data is synced across team

**Option 2: Individual Database**
- Each member creates own MongoDB Atlas account (free)
- Own data for testing
- Guide: https://www.mongodb.com/docs/atlas/getting-started/

---

## 📋 Complete Setup Steps

### 1. Prerequisites
- Node.js v18+
- Git
- Code editor

### 2. Clone Repository
```bash
git clone https://github.com/ashurai1/CareerBridge.git
cd CareerBridge
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Setup

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```

Edit and add credentials from team lead.

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
```

Should contain:
```env
VITE_API_URL=http://localhost:8000/api
```

### 5. Start Development
```bash
npm run dev
```

**Verify**:
- ✅ Backend: http://localhost:8000
- ✅ Frontend: http://localhost:5173
- ✅ MongoDB connected

---

## 🔄 Daily Workflow

```bash
# Morning: Pull latest
git pull origin main
npm install  # If dependencies changed

# Work
npm run dev

# Evening: Push changes
git add .
git commit -m "feat: Your feature"
git push origin main
```

---

## 🐛 Common Issues

**Port in use**:
```bash
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
```

**MongoDB connection failed**:
- Check MongoDB URI
- Verify IP whitelisted (ask team lead)
- Check password (no special chars or URL encode)

**Environment variables not loading**:
- Restart server (Ctrl+C, then `npm run dev`)

---

## 📞 Contact Team Lead For:
- Database credentials
- OAuth setup
- Access issues
- Environment variables

---

**Happy Coding! 🚀**
