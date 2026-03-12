# Nexus — Premium E-Commerce Store

![Nexus Logo](public/favicon.png)

**Nexus** is a full-featured, premium e-commerce storefront built with modern web technologies. It offers a curated shopping experience across multiple product categories including electronics, fashion, beauty, home, sports, gadgets, phones, laptops, and TVs.

---

## 🌐 Live Preview

Built & deployed on [Lovable](https://lovable.dev).

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog** — Browse products with grid/list views, search, and advanced filters (price range, category, rating, discounts)
- **Category Navigation** — Shop by category with dynamic category pages
- **Product Detail Pages** — High-quality image zoom, product descriptions, ratings, and related products
- **Quick View Modal** — Preview products without leaving the current page
- **Flash Sales** — Timed flash sale section with countdown timer
- **Deals of the Day** — Highlighted discount products
- **Trending & Featured** — Curated product sections on the homepage

### 🛒 Cart & Checkout
- **Shopping Cart** — Add, remove, update quantities with real-time totals
- **Cart Preview** — Hover preview in the navbar
- **Multi-step Checkout** — Shipping → Payment → Review flow
- **Order Placement** — Persisted to the database with order tracking
- **Tax Calculation** — Automatic tax computation at checkout

### ❤️ Wishlist
- **Save Favorites** — Toggle products to/from your wishlist
- **Persistent Storage** — Wishlist persists across sessions

### 👤 Authentication & Profiles
- **Email/Password Auth** — Sign up, sign in, email verification
- **Google OAuth** — One-click Google sign-in
- **Password Reset** — Forgot password flow with email recovery
- **User Profiles** — Edit name, phone, city, and address
- **Order History** — Track past orders with visual status timeline (Pending → Confirmed → Shipped → Delivered)

### 🤖 AI Shopping Assistant
- **Chat Widget** — Floating AI chat powered by streaming responses
- **Quick Questions** — Pre-built prompts for shipping, returns, deals, and help
- **Markdown Rendering** — Rich AI responses with formatted text

### 🎨 Design & UX
- **Dark/Light Mode** — Toggle between themes with system preference detection
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop
- **Smooth Animations** — Page transitions and micro-interactions via Framer Motion
- **Premium Aesthetic** — Gold accent design system with Playfair Display + Inter typography
- **Image Zoom** — Click-to-zoom on product images with cursor tracking
- **Auto-rotating Hero** — Ken Burns effect slider with progress indicators

### 🔧 Admin Dashboard
- **Protected Admin Routes** — Role-based access control (admin/moderator/user)
- **Dashboard Overview** — Analytics and key metrics
- **Product Management** — CRUD operations for products
- **Category Management** — Manage store categories
- **Order Management** — View and manage customer orders
- **Analytics** — Visual charts and reporting

### 📧 Newsletter & Engagement
- **Newsletter Signup** — Email subscription in footer and dedicated section
- **Customer Testimonials** — Auto-rotating review carousel
- **Brand Marquee** — Scrolling trusted brands section
- **Stats Section** — Key store metrics display

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animations** | Framer Motion |
| **Routing** | React Router v6 |
| **State Management** | React Context API |
| **Server State** | TanStack React Query |
| **Backend** | Lovable Cloud (Supabase) |
| **Database** | PostgreSQL |
| **Authentication** | Lovable Cloud Auth (Email, Google OAuth) |
| **AI Chat** | Edge Functions with streaming |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Toasts** | Sonner |

---

## 📁 Project Structure

```
src/
├── assets/            # Static images (hero banners, category images)
├── components/
│   ├── admin/         # Admin layout & sidebar
│   ├── chat/          # AI chat widget
│   ├── home/          # Homepage sections (hero, categories, deals, etc.)
│   ├── layout/        # Navbar, Footer, Layout wrapper
│   ├── products/      # ProductCard, QuickView, Reviews
│   └── ui/            # shadcn/ui component library
├── contexts/          # Auth, Store (cart/wishlist), Theme providers
├── hooks/             # Custom hooks (useProducts, useCategories, useAdmin)
├── integrations/      # Supabase client & types
├── pages/             # Route pages (Index, Products, Cart, Checkout, etc.)
│   └── admin/         # Admin pages (Dashboard, Products, Orders, etc.)
├── types/             # TypeScript type definitions
└── main.tsx           # App entry point
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `products` | Store product catalog (name, price, category, stock, badges) |
| `categories` | Product categories with images and sort order |
| `orders` | Customer orders with items, totals, and shipping info |
| `profiles` | User profile data (name, phone, address) |
| `reviews` | Product reviews with ratings |
| `user_roles` | Role-based access (admin, moderator, user) |

---

## 🔐 Security

- **Row Level Security (RLS)** — All database tables protected with RLS policies
- **Role-based Access** — Admin routes protected via `has_role()` database function
- **Server-side Validation** — Admin status checked via secure database queries, never client-side
- **Separate Roles Table** — User roles stored independently to prevent privilege escalation

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** (comes with Node.js) or **bun**

### Local Development

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to project directory
cd <YOUR_PROJECT_NAME>

# 3. Install dependencies
npm install

# 4. Create a .env file in the project root with the following variables:
```

```env
VITE_SUPABASE_URL="https://cdmkxkclmrmvytyfedcm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
VITE_SUPABASE_PROJECT_ID="cdmkxkclmrmvytyfedcm"
```

```bash
# 5. Start the development server
npm run dev
```

The app will be available at **http://localhost:8080**.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint code with ESLint |

> **Note:** The backend (database, auth, edge functions) is hosted on Lovable Cloud — no additional backend setup is required.

---

## 📦 Key Dependencies

- **@supabase/supabase-js** — Database & auth client
- **@tanstack/react-query** — Async state management
- **framer-motion** — Animation library
- **react-router-dom** — Client-side routing
- **recharts** — Data visualization
- **react-markdown** — Markdown rendering for AI chat
- **sonner** — Toast notifications
- **zod** — Schema validation

---

## 🌙 Theming

Nexus uses a custom design token system defined in `src/index.css`:

- **Light Mode** — Warm cream background with gold accents
- **Dark Mode** — Deep blue-gray background with gold accents
- **Gold Accent** — `hsl(38 70% 50%)` used throughout for premium feel
- **Typography** — Playfair Display (headings) + Inter (body)

---

## 📄 License

This project is private. All rights reserved.

---

Built with ❤️ using [Lovable](https://lovable.dev)
