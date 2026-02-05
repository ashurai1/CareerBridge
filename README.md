[![Project Demo](https://img.shields.io/badge/▶-Watch_Demo-red?style=for-the-badge)](https://drive.google.com/file/d/1MztrIt8ftXMUDjr4xtGsixoIwDrxPEn0/view)

# CareerBridge 🌉

CareerBridge is a full-stack MERN (MongoDB, Express, React, Node.js) application connecting job seekers with employers. It features role-based dashboards, job management, application tracking, and real-time notifications.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local server or Atlas URL)
- Git

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/ashurai1/CareerBridge.git
cd CareerBridge
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

1. **Backend Environment**:
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/careerbridge  # Or your MongoDB Atlas URL
   JWT_SECRET=your_super_secret_key_123
   CLIENT_URL=http://localhost:5173
   ```

2. **Frontend Environment**:
   The frontend is configured to talk to `http://localhost:8000` by default via Vite proxy. No extra setup needed for local dev.

## 🏃‍♂️ How to Run (Step-by-Step)

You need to run **3 separate terminals**:

### Terminal 1: Database
Start MongoDB (if running locally):
```bash
mongod --dbpath ~/data/db --port 27017
```

### Terminal 2: Backend API
```bash
cd backend
npm run dev
```
*Server will start on port 8000*

### Terminal 3: Frontend Client
```bash
cd frontend
npm run dev
```
*Client will run on http://localhost:5173*

## ✨ Key Features
- **Responsive Dashboard**: Works on Mobile, Tablet, and Desktop.
- **Role-Based Access**: Separate views for Candidates and Employers.
- **Job Management**: Employers can Post, Edit, and Delete jobs.
- **Application Tracking**: View applicants and manage their status (Shortlist/Reject).
- **Dark/Light Theme**: Customized UI with glassmorphism effects.

## 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
