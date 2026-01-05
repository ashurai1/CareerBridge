# CareerBridge - Professional Job Portal

![Project Status](https://img.shields.io/badge/Project%20Status-Working-success)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)

CareerBridge is a modern, professional job portal platform connecting candidates with employers. Built with the **MERN Stack** (MongoDB, Express.js, React, Node.js), it features a high-performance serverless backend and a responsive, animated frontend.

## 🚀 Features

- **Professional UI/UX**: Clean, corporate design with advanced animations (Bridge Loader, Slide Transitions).
- **Dual Role System**: Seamless toggle between "Candidate" and "Employer" flows.
- **Secure Authentication**: JWT-based auth with secure password hashing.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Serverless Ready**: Configured for tailored deployment on Vercel.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), CSS3 (Variables, Animations), FontAwesome.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Deployment**: Vercel (Frontend & Serverless Backend).

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashurai1/CareerBridge.git
   cd CareerBridge
   ```

2. **Install Dependencies**
   ```bash
   # Install Root dependencies
   npm install

   # Install Frontend dependencies
   cd frontend
   npm install

   # Install Backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Run Locally**
   ```bash
   # From the root directory
   npm run dev
   ```

## ☁️ Deployment (Vercel)

This project is configured for **Vercel Monorepo Deployment**.

1. Push to GitHub.
2. Import project into Vercel.
3. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`) in Vercel settings.
4. Deploy!

---

**Developed by Ashwani Rai**
