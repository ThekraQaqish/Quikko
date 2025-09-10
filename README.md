# Quikko - Unified Local Shopping Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue)](https://reactjs.org/)

Quikko is a comprehensive e-commerce platform that unifies local stores in one place, providing seamless shopping experiences for customers, efficient management for vendors, delivery tracking, and full admin oversight.

---

## 🎯 Vision & Mission

**Vision:**  
To be the leading platform that unifies all local stores in one place, making shopping easier and connecting vendors with customers through smart and integrated solutions.

**Mission:**  
To empower small and medium-sized businesses to reach a wider customer base, while providing shoppers with a seamless purchasing experience and a reliable unified delivery service.

---

## 📦 Features

### Customer (Buyer)
- Sign up / Login, Guest Checkout  
- Browse Products & Stores (Categories, Search, Filters)  
- Product Details & Multi-store Cart  
- Checkout (COD / Online Payment)  
- Order Tracking & Notifications  
- Wishlist & Loyalty Points  
- Product & Store Reviews  
- Multi-language & Dark/Light Mode  

### Vendor (Store Owner)
- Registration & Admin Approval  
- Storefront Page with Logo/Banner  
- Product Management (Add/Edit/Delete + Variants/Images)  
- Order Management & Customer Chat  
- Basic Reports & Analytics  
- Coupons & Discounts  
- Dark/Light Mode  

### Delivery Company
- Registration & Admin Approval  
- Delivery Dashboard  
- Update Order Status & Tracking  
- Manage Coverage Areas & Pricing  

### Admin (Platform Management)
- Dashboard Overview (Sales, Orders, Vendors, Deliveries)  
- Vendor & Delivery Company Management  
- Order Monitoring  
- Commission & Fees Settings  
- Content Management (CMS / Pages / Banners)  
- Mass Notifications  
- Payment Integration  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- React Router  
- React Query / SWR  

### Backend
- Node.js + Express  
- JWT Authentication  
- Firebase Cloud Functions  

### Database
- PostgreSQL (Structured Data)  
- Firebase Firestore (Real-time Updates)  

### Notifications
- Firebase Cloud Messaging (Push Notifications)  

### Payments
- Stripe / PayPal / Paystack Integration  

### Dev Tools
- Figma (UI/UX Design)  
- ESLint + Prettier (Code Quality)  
- Vite / Next.js (Frontend Bundling / SSR)  

---

## ⚡ Getting Started

### Prerequisites
- Node.js >= 18  
- PostgreSQL >= 15  
- Firebase account for Auth & Messaging  

### Installation

**Clone the repo:**

---
### Backend Setup:
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```
---

### Frontend Setup:
```bash
cd frontend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```
---
 ### 🔗 Useful Scripts

#### Backend
```bash 
npm run dev        # Start dev server with nodemon
npm run build      # Build backend for production
npm run start      # Start production server
```

#### Frontend
```bash
npm run dev        # Start frontend dev server
npm run build      # Build frontend for production
npm run preview    # Preview production build
```
---
### ✅ Best Practices Followed

Modular separation of frontend and backend

.gitignore to exclude sensitive files and node_modules

.env files for secrets & environment-specific configs

API versioning for future-proof endpoints

Role-based authentication & access control

Real-time updates using Firebase for user engagement

Responsive & accessible UI design with Tailwind

Code quality enforced with ESLint + Prettier
---

### 📚 Contribution Guidelines

Fork the repository

Create a feature branch: git checkout -b feature/your-feature

Commit your changes: git commit -m "Add your message"

Push to branch: git push origin feature/your-feature

Open a Pull Request
---

### 📝 License

© 2025 Thekra Qaqish. All Rights Reserved. ❤

