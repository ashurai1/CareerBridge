# CareerBridge - Job Portal Platform

A modern MERN stack job portal connecting candidates with employers.

## 🚀 Quick Start

### For Team Members

**Complete setup guide**: See [TEAM_SETUP.md](./TEAM_SETUP.md)

```bash
# 1. Clone repository
git clone https://github.com/ashurai1/CareerBridge.git
cd CareerBridge

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with credentials from team lead

# 4. Start development server
npm run dev
```

**Servers**:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## � Features

- 🔐 **Authentication**: Email/password + OAuth (Google, GitHub, LinkedIn)
- 👤 **User Roles**: Candidate & Employer dashboards
- 💼 **Job Management**: Post, browse, and apply for jobs
- 📊 **Application Tracking**: Monitor application status
- 🎨 **Modern UI**: Responsive design with smooth animations

---

## 🛠️ Tech Stack

**Frontend**:
- React + Vite
- React Router
- CSS3 with animations

**Backend**:
- Node.js + Express
- MongoDB Atlas (Cloud Database)
- Passport.js (OAuth)
- JWT Authentication

---

## 📁 Project Structure

```
CareerBridge/
├── backend/
│   ├── config/         # Database, Passport config
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── middleware/     # Auth middleware
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   └── services/   # API services
│   └── public/         # Static assets
└── package.json        # Root dependencies
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_KEY=your_linkedin_client_id
LINKEDIN_SECRET=your_linkedin_client_secret
BASE_URL=http://localhost:8000
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000/api
```

> **Note**: Contact team lead for actual credential values.

---

## 🗄️ Database

**MongoDB Atlas** (Cloud Database)
- Shared database for team collaboration
- Free tier: 512MB storage
- Always available (24/7)

**Connection**: Team lead will provide MongoDB URI

---

## 🔄 Development Workflow

```bash
# Pull latest changes
git pull origin main

# Create feature branch (optional)
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: Add your feature"

# Push changes
git push origin main
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
npm run dev
```

### MongoDB Connection Failed
- Verify MongoDB URI in `.env`
- Check if IP is whitelisted in MongoDB Atlas
- Contact team lead for access

### Environment Variables Not Loading
- Restart server (Ctrl+C, then `npm run dev`)
- Check `.env` file exists in correct location

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth
- `GET /api/auth/linkedin` - LinkedIn OAuth

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (Employer only)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job (Employer only)
- `DELETE /api/jobs/:id` - Delete job (Employer only)

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications` - Get user applications
- `PUT /api/applications/:id` - Update application status

---

## 🤝 Contributing

1. Clone the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Commit with clear message
6. Push and create PR (if using branches)

---

## 📞 Support

**Team Lead**: Contact for:
- Database credentials
- OAuth setup
- Environment variables
- Access issues

**GitHub Issues**: Report bugs or request features

---

## 📄 License

This project is for educational purposes.

---

## 🎓 Team Members

- **Lead**: Ashwani Rai
- **Members**: [Add team member names]

---

**Built with ❤️ using MERN Stack**
