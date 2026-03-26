
# Stepper Auth App

A full-stack MERN application with JWT authentication and a multi-step (stepper) form. It includes access + refresh token flow, protected routes, and structured form handling using React Hook Form.

---

## Overview

This project demonstrates:

- Secure authentication using JWT (access + refresh tokens)
- Token refresh handling with Axios interceptors
- Multi-step form with validation (Zod)
- Protected routes on frontend and backend
- Reusable form components

---

## Tech Stack

Frontend:
- React (Vite)
- React Hook Form
- Zod (validation)
- Axios

Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

---

## Getting Started

### Clone the project

git clone <your-repo-url>
cd stepper-auth-app

---

## Backend Setup

cd server
npm install

Create a `.env` file:

MONGO_URI=mongodb://localhost:27017/stepper-auth-app
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
PORT=5000

Run server:

npm run dev

Server: http://localhost:5000

---

## Frontend Setup

cd client
npm install
npm run dev

Client: http://localhost:5173

---

## API Reference

### Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

### User

GET /api/user/profile
POST /api/user/submit-form

Use header:

Authorization: Bearer <accessToken>

---

## Auth Flow

1. Login → access + refresh token issued
2. Access token used in API calls
3. Expired token → auto refresh via interceptor
4. Logout → tokens cleared

---

## Features

- JWT Auth with refresh tokens
- Auto token refresh
- Stepper form with validation
- Protected routes
- Clean architecture

---
