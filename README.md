# ShopSphere — Amazon-Inspired E-Commerce Marketplace

ShopSphere is a full-stack educational e-commerce marketplace closely inspired by Amazon's user experience, design systems, and architecture. It features a complete REST API backend (Node.js/Express/MongoDB), a responsive React 18 frontend with Vite and Tailwind CSS, JWT authentication, simulated demonstration checkout (Cash on Delivery & Instant Test Pay), and native Vercel deployment readiness.

---

## 🌟 Key Features

### 🛍️ Amazon-Inspired Shopping Experience
- **Header:** Sticky marketplace top bar with logo, Delivery Location picker, category-filtered Search Bar with live suggestions, Country/Language selector (`🇮🇳 EN`), "Account & Lists" dropdown menu, "Returns & Orders", and shopping cart with live item badge.
- **Navigation:** Sub-navigation bar with sliding drawer ("All" menu) categorizing departments, trending releases, and help topics.
- **Homepage:**
  - Promotional Hero Carousel with smooth autoplay and pause controls.
  - Distinctive **Amazon 2x2 Multi-Quadrant Category Grid** ("Level up your beauty routine", "Plug in with our electronics", "Fantastic finds for home", "Look your best this season", "Top PCs & Accessories", etc.).
  - "Today's Deals" and "Best Sellers" horizontal scroll carousels.
  - Personalized recommendations prompt.
  - "Recently Viewed Products" history tracker.
- **Footer:** Deep slate-navy 4-tier Amazon-style directory (Get to Know Us, Make Money with Us, Payment Products, Let Us Help You), smooth "Back to top", currency/region selector, and subsidiary services grid.

### 📦 Comprehensive Product Catalog & Filtering
- Rich catalog across 7 major departments: Electronics, Fashion, Home & Kitchen, Beauty, Books, Toys, and Sports & Fitness.
- Multi-dimensional filters: Price slider, minimum rating (1-4 stars), brand checkboxes, in-stock toggle, and deals filter (≥25% discount).
- Sort options: Featured, Price Low to High, Price High to Low, Customer Rating, Newest Arrivals, and Best Sellers.
- Product details: Interactive multi-image gallery with zoom/select, specifications table, verified customer reviews, buy box, and related products carousel.

### 🔒 Full-Stack Security & Authentication
- **Password Hashing:** Passwords securely hashed with `bcryptjs` (salt rounds: 10).
- **Session Tokens:** Stateless JSON Web Tokens (JWT) signed with environment secrets.
- **Server-Side Price Integrity:** Order subtotals and grand totals are calculated exclusively on the backend from verified database records. Client-submitted prices are strictly disregarded.
- **Stock Validation:** Real-time stock reservation and verification during order creation, with automatic inventory restoration upon order cancellation.
- **Ownership Enforcement:** Users are strictly isolated to their own orders, cart, and address book.

### 💳 Simulated Demonstration Checkout (No Real Gateways)
- **Zero Real Financial Transactions:** Strictly designed for educational use. No Stripe, Razorpay, or PayPal credentials required.
- **Supported Options:**
  - Cash on Delivery (Simulated)
  - Instant Test Card Checkout (Simulated)
- **Order Lifecycle:** Orders generate unique identifiers (`ORD-...`), receive estimated delivery dates, and can be tracked or cancelled directly in the user order dashboard.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite 7, React Router DOM v7, Tailwind CSS, Lucide React, react-hot-toast, Axios |
| **Backend** | Node.js (v20+ / v22 LTS), Express.js, RESTful APIs, Mongoose, JWT, bcryptjs, Helmet, CORS |
| **Database** | MongoDB Atlas (Production) + Resilient In-Memory Mock Store (Development / Fallback) |
| **Deployment** | Vercel (Single-Project Monorepo with Serverless API at `/api`) |

---

## 🚀 Quick Start (Local Execution)

### Prerequisites
- Node.js (v20.19+ or v22.12+ LTS recommended)
- npm (v10+)

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root folder (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=shopsphere-super-secure-production-jwt-secret-replace-me-32chars
```
> **Note:** If `MONGODB_URI` is omitted, ShopSphere automatically initializes its built-in in-memory mock store pre-seeded with demo products, users, and orders!

### 3. Running Locally

#### Start Backend API Server:
```bash
npm run server
```
*Backend runs on `http://localhost:5000`*

#### Start Frontend Client (in a separate terminal):
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Demo Account Credentials

For instant evaluation, you can use the built-in demo customer account:
- **Email:** `demo@shopsphere.com`
- **Password:** `demo12345`

*(A one-click "Fill Demo" button is also provided directly on the Login screen!)*

---

## ☁️ Vercel Deployment Guide

ShopSphere is pre-configured for seamless single-project deployment on Vercel:

1. **Push your code to GitHub / GitLab:**
   ```bash
   git add .
   git commit -m "feat: complete full-stack ShopSphere marketplace"
   git push origin main
   ```
2. **Import into Vercel:**
   - Log into your [Vercel Dashboard](https://vercel.com).
   - Click **"Add New Project"** and select your repository.
   - Framework Preset: **Vite**.
   - Root Directory: `./`.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. **Configure Environment Variables in Vercel:**
   - `JWT_SECRET`: A secure random 32+ character string.
   - `MONGODB_URI`: (Optional) Your MongoDB Atlas connection string (e.g., `mongodb+srv://user:pass@cluster0.mongodb.net/shopsphere?retryWrites=true&w=majority`).
4. **Deploy:** Click **Deploy**. Vercel will automatically serve the Vite frontend from `dist` and route `/api/*` to the serverless Express function at `api/index.ts`.

---

## 📡 API Reference Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Service health status and database mode | No |
| `POST` | `/api/auth/register` | Create a new customer account | No |
| `POST` | `/api/auth/login` | Authenticate customer and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile and address book | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `GET` | `/api/products` | Paginated search, category, brand, and deal filtering | No |
| `GET` | `/api/products/:id` | Fetch single product by identifier | No |
| `GET` | `/api/products/:id/related` | Fetch category-related items | No |
| `GET` | `/api/orders` | Fetch authenticated user's order history | Yes |
| `POST` | `/api/orders` | Place simulated order with server-side pricing | Yes |
| `GET` | `/api/orders/:orderId` | Fetch order details (ownership protected) | Yes |
| `PUT` | `/api/orders/:orderId/cancel` | Cancel order and restore stock | Yes |
| `GET` | `/api/users/addresses` | Fetch saved delivery addresses | Yes |
| `POST` | `/api/users/addresses` | Save new delivery address | Yes |
| `PUT` | `/api/users/addresses/:id` | Update delivery address | Yes |
| `DELETE`| `/api/users/addresses/:id` | Remove delivery address | Yes |

---

## 📜 Educational Disclaimer

ShopSphere is an educational prototype developed for demonstrative and portfolio purposes. Product photographs are sourced royalty-free from Pexels under their creative license. All simulated transactions, prices, brand names, and shipping commitments are fictional.
