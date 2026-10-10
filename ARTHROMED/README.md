# ArthroMed — Orthopedic & Breg® Medical Products Platform

A complete, production-ready full-stack web application for **ArthroMed**, a medical platform delivering certified orthopedic braces, post-operative cold therapy systems, and joint mobility solutions.

---

## 🏗️ Architecture & Tech Stack

| Tier | Technology | Key Features |
|---|---|---|
| **Frontend** | **Angular 18+** (Standalone Components) | Signals, RxJS, Modern Control Flow (`@if`, `@for`, `@empty`), Responsive Medical Theme, WhatsApp Integration |
| **Backend** | **Node.js, Express, TypeScript** | RESTful API, Multer RAM buffer streaming to Supabase Storage, In-memory seed resilience |
| **Cloud Storage** | **Supabase Storage** | Bucket `arthromed-products` for direct asset uploads |

---

## 📁 Repository Structure

```
ARTHROMED/
├── .gitignore
├── README.md
├── backend/                  <-- Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.ts   # Supabase client & environment initialization
│   │   ├── controllers/
│   │   │   ├── product.controller.ts # Product CRUD & seed data
│   │   │   └── upload.controller.ts  # Memory-buffered Supabase streamer
│   │   ├── middleware/
│   │   │   └── upload.middleware.ts  # Multer in-memory storage buffer
│   │   ├── models/
│   │   │   └── product.model.ts      # Shared strict product TypeScript contract
│   │   ├── routes/
│   │   │   ├── product.routes.ts     # /api/products router
│   │   │   └── upload.routes.ts      # /api/upload router
│   │   └── index.ts          # Express server entry point (Port 3000)
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── tsconfig.json
└── frontend/                 <-- Angular 18+ (Standalone Components)
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── models/product.model.ts       # Shared Product model
    │   │   │   └── services/products.service.ts  # Signal/RxJS service with local mock fallback
    │   │   ├── shared/components/
    │   │   │   ├── navbar/           # Header with WhatsApp CTA and mobile drawer
    │   │   │   ├── footer/           # Clinical footer, legal disclaimer & contact
    │   │   │   └── loading-skeleton/ # Pulse loading skeletons
    │   │   ├── pages/
    │   │   │   ├── home/             # Comprehensive medical landing page
    │   │   │   │   ├── sections/
    │   │   │   │   │   ├── hero/
    │   │   │   │   │   ├── about-snippet/
    │   │   │   │   │   ├── services/
    │   │   │   │   │   ├── why-choose-us/
    │   │   │   │   │   ├── stats/
    │   │   │   │   │   ├── testimonials/
    │   │   │   │   │   └── cta-banner/
    │   │   │   │   └── home.component.ts
    │   │   │   ├── products/         # Catalog & Search
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── filter-bar/
    │   │   │   │   │   ├── product-card/
    │   │   │   │   │   └── empty-state/
    │   │   │   │   ├── product-detail/product-detail.component.ts
    │   │   │   │   └── products.component.ts
    │   │   │   └── admin/            # Inventory Management Portal
    │   │   │       ├── admin-products.component.ts
    │   │   │       └── product-form/product-form.component.ts
    │   │   ├── app.routes.ts
    │   │   └── app.component.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css        # Clinical design system & CSS variables
    ├── angular.json
    ├── package.json
    ├── tsconfig.json
    └── tsconfig.app.json
```

---

## ⚡ Quick Start & Execution

### 1. Backend Setup (Port 3000)

```bash
cd ARTHROMED/backend

# Install dependencies
npm install

# (Optional) Configure Supabase credentials in .env
cp .env.example .env

# Run development server with live reload
npm run dev

# Or build and run production
npm run build
npm start
```
*Backend runs at `http://localhost:3000` with CORS configured for `http://localhost:4200`.*

### 2. Frontend Setup (Port 4200)

```bash
cd ARTHROMED/frontend

# Install dependencies
npm install

# Launch Angular development server
npm start
```
*Open [http://localhost:4200](http://localhost:4200) in your browser.*

---

## 🛡️ Fallback Resilience & Zero-Config Mode

- **Backend:** Ships pre-populated with **6 authentic Breg® orthopedic products** (Breg Polar Care Wave, Fusion XT, SlingShot 3, Pinnacle LSO, Genesis Walker Boot, FreeRunner OA). If Supabase credentials are not provided, the backend operates seamlessly with its in-memory store.
- **Frontend:** `products.service.ts` contains identical local seed data. If the backend server is stopped or offline, the entire Angular catalog, details, search, and filtering continue to function without crashing!

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Query / Body | Description |
|---|---|---|---|
| `GET` | `/api/products` | `?category=&search=&sort=` | List all products with filtering and sorting |
| `GET` | `/api/products/:id` | — | Retrieve single product details |
| `POST` | `/api/products` | `JSON (Product)` | Create new orthopedic product |
| `PUT` | `/api/products/:id` | `JSON (Partial<Product>)` | Update existing product |
| `DELETE` | `/api/products/:id` | — | Delete product & remove its image from Supabase Storage |
| `POST` | `/api/upload` | `multipart/form-data (image)` | Stream image to Supabase RAM buffer without writing to disk |

---

## 💬 WhatsApp Clinical Integration

All product cards and detail views generate dynamic direct inquiry WhatsApp links:
```
https://wa.me/18005550199?text=Hello%20ArthroMed!%20I%20would%20like%20to%20inquire%20about%20the%20[Product%20Name]%20(SKU%3A%20[SKU]).
```
Surgeons, hospital buyers, and patients can initiate orders with a single click.
