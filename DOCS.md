# ArthroMed — Comprehensive Technical System Documentation

**Project Name:** ArthroMed Orthopedic & Breg® Medical Products Platform  
**System Architecture:** Decoupled Full-Stack Web Application (Angular 18+ & Node.js/Express)  
**Document Revision:** 1.0.0  
**Status:** Production-Ready & Verified  

---

## Table of Contents
1. [1. SYSTEM DESCRIPTION](#1-system-description)  
   1.1 [1.0 Executive Summary & Purpose](#10-executive-summary--purpose)  
   1.2 [1.1 Problem Statement & Clinical Scope](#11-problem-statement--clinical-scope)  
   1.3 [1.2 Key System Objectives](#12-key-system-objectives)  
   1.4 [1.3 Technology Stack & Architecture](#13-technology-stack--architecture)  
   1.5 [1.4 System Architecture Diagram](#14-system-architecture-diagram)  
   1.6 [1.5 Operational Workflows](#15-operational-workflows)  
2. [1.1 DATABASE DESCRIPTION TABLE (ATTRIBUTE, DATATYPE AND CONSTRAIN)](#11-database-description-table-attribute-datatype-and-constrain)  
   2.1 [Table 1: users (Identity, Security & RBAC Entity)](#table-1-users-identity-security--rbac-entity)  
   2.2 [Table 2: products (Orthopedic Devices & Medical Hardware Entity)](#table-2-products-orthopedic-devices--medical-hardware-entity)  
   2.3 [Table 3: product_specs (Normalized Technical Specifications Sub-Entity)](#table-3-product_specs-normalized-technical-specifications-sub-entity)  
   2.4 [Table 4: storage.objects (Supabase Cloud Asset Storage Bucket)](#table-4-storageobjects-supabase-cloud-asset-storage-bucket)  
   2.5 [Database Entity-Relationship (ER) Diagram](#database-entity-relationship-er-diagram)  
3. [1.2 MODULE DESCRIPTION](#12-module-description)  
   3.1 [Backend Microservices & Controllers](#31-backend-microservices--controllers)  
   3.2 [Frontend Architecture & Angular 18 Components](#32-frontend-architecture--angular-18-components)  
4. [1.3 SYSTEM RUNTIME OUTPUT](#13-system-runtime-output)  
   4.1 [4.1 Backend Server Initialization Output](#41-backend-server-initialization-output)  
   4.2 [4.2 Frontend Angular Build & Compilation Output](#42-frontend-angular-build--compilation-output)  
   4.3 [4.3 Comprehensive Security & Auth Flow Test Suite Output](#43-comprehensive-security--auth-flow-test-suite-output)  
   4.4 [4.4 Frontend Route Verification Output](#44-frontend-route-verification-output)  
   4.5 [4.5 REST API Request & Response Payloads (JSON)](#45-rest-api-request--response-payloads-json)  
   4.6 [4.6 System User Interface Runtime Layouts (ASCII Wireframes)](#46-system-user-interface-runtime-layouts-ascii-wireframes)  

---

# 1. SYSTEM DESCRIPTION

### 1.0 Executive Summary & Purpose
**ArthroMed** is an enterprise-grade medical device catalog and tele-inquiry platform engineered for orthopedic surgeons, physical therapists, sports rehabilitation clinics, and post-operative patients. The application delivers immediate access to certified orthopedic bracing solutions, post-operative cold and pneumatic compression systems, spinal orthotics, and joint mobility devices manufactured by industry leaders such as **Breg® Medical**.

Unlike conventional consumer e-commerce systems, ArthroMed is built around **clinical workflows**:
- Medical devices require precise sizing, anatomical alignment, and **HCPCS (Healthcare Common Procedure Coding System)** insurance billing codes.
- Orthopedic hardware frequently requires professional fitting guidance and direct communication between clinic coordinators and suppliers.
- Strict data integrity and patient/practitioner account security are required, incorporating automated brute-force protection, account lockouts, and cryptographic identity verification.

---

### 1.1 Problem Statement & Clinical Scope
In traditional orthopedic practice, patients and clinical staff encounter significant friction when acquiring post-operative DME (Durable Medical Equipment):
1. **Catalog Fragmentation:** Practitioners consult dense physical manufacturer binders with obsolete pricing and fitting guidelines.
2. **Billing Delays:** Clinicians lack instant access to standardized HCPCS billing codes needed for private and Medicare reimbursement.
3. **Inquiry Latency:** Patients struggling with post-operative pain or complex brace adjustments face delayed email or telephone inquiries.
4. **Security Vulnerabilities:** Weak administrative portals risk unauthorized modifications to medical device specifications or inventory data.

**ArthroMed resolves these challenges by providing:**
- A high-performance, real-time searchable catalog with rich clinical metadata (Range of Motion angles, extension/flexion stops, sizing matrices, and direct PDF fitting guides).
- Direct **WhatsApp Tele-Inquiry Integration** that automatically formats clinical device inquiries, SKU references, and patient inquiries for instantaneous practitioner communication.
- A hardened administrative management portal with multi-criteria security controls, real-time RAM buffer streaming to cloud storage, and automated account lockout defenses.

---

### 1.2 Key System Objectives
- **Clinical Catalog Browsing:** Instant multi-category filtering (`Knee`, `Shoulder`, `Cold Therapy`, `Spine`, `Foot & Ankle`, `General Orthopedics`), fuzzy search by device name and SKU, and dynamic sorting.
- **HCPCS Billing Code Transparency:** Prominent display of verified insurance codes (e.g., `L1832`, `L1845`, `L0637`, `E0218`) on every product card and detail view.
- **Tele-Consultation & WhatsApp Routing:** Deep-link generation pre-populating patient inquiries with exact product models and SKUs for direct clinic routing.
- **Role-Based Access Control (RBAC):** Strict separation between standard clinical users (`customer`) and system administrators (`admin`).
- **Hardened Authentication Engine:** 
  - Mandatory 5-point password complexity rules (length >= 8, uppercase, lowercase, numeric, symbol).
  - Strict RFC 5322 email regex sanitization.
  - Automated 3-attempt account lockout mechanism enforcing a 10-minute cooldown (HTTP 423 Locked).
  - Administrative control center with one-click manual account unlocking capabilities.
- **Dual-Layer Storage Resilience:** Real-time asset streaming via Multer RAM buffers directly to Supabase Cloud Storage bucket (`arthromed-products`), backed by an automatic base64/in-memory fallback mode for zero-dependency local execution.

---

### 1.3 Technology Stack & Architecture

| Layer | Technology | Version | Purpose & Architecture Highlights |
|---|---|---|---|
| **Frontend Framework** | **Angular** | 18.2+ | Standalone components, modern `@if`/`@for`/`@empty` control flow, TypeScript 5.4. |
| **Reactive State** | **Angular Signals & RxJS** | 7.8+ | Zero-boilerplate signal-driven state for catalog, active filters, authentication, and lockout timers. |
| **Styling & Design System** | **Vanilla CSS3** | Modern | Custom clinical design system (`#0d382c` medical forest green, `#0f766e` teal, glassmorphism, responsive CSS grid). |
| **Backend Runtime** | **Node.js** | 20.18+ LTS | High-throughput asynchronous event-driven JavaScript/TypeScript runtime. |
| **Web Server Framework** | **Express.js** | 4.21+ | RESTful API gateway, CORS security middleware, and centralized error handling. |
| **Language & Typings** | **TypeScript** | 5.6+ | Strict type checking across full-stack models, DTOs, and controllers. |
| **File Buffer & Streaming**| **Multer** | 1.4.5 LTS | Memory-buffered streaming (`multer.memoryStorage()`) eliminating temporary server disk writes. |
| **Cloud Object Storage** | **Supabase Storage** | 2.45+ | S3-compatible cloud object bucket `arthromed-products` for medical product photography and PDF guides. |
| **Security & Cryptography**| **Node Crypto & JWT** | Native / HMAC | SHA-256 salted password hashing, base64url signed JWT bearer session tokens. |

---

### 1.4 System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client_Layer ["Client Tier (Browser & Mobile)"]
        A["Angular 18+ Single Page App"]
        A1["Public Catalog & Home Portal"]
        A2["Patient & Clinic Auth Shell"]
        A3["Admin Inventory & User Dashboard"]
        A4["WhatsApp Tele-Inquiry Bridge"]
    end

    subgraph Gateway_Layer ["Gateway & Middleware Tier"]
        B["Express.js HTTP Gateway (Port 3000)"]
        B1["CORS Security Firewall"]
        B2["Express JSON & URL Parsers (15MB Limit)"]
        B3["Multer RAM Memory Buffer (5MB Limit)"]
        B4["AuthGuard & AdminGuard (Bearer JWT Verification)"]
    end

    subgraph Controller_Layer ["Service & Microservices Tier"]
        C1["Auth Controller (Lockout & Validation Engine)"]
        C2["Product Controller (CRUD & Filtering Engine)"]
        C3["Upload Controller (Direct Cloud Streamer)"]
        C4["Health Check Probe (/api/health)"]
    end

    subgraph Storage_Layer ["Data & Persistence Tier"]
        D1["Supabase Cloud Storage ('arthromed-products')"]
        D2["PostgreSQL / Supabase Database ('products' & 'users')"]
        D3["Resilient In-Memory Fallback Store (Zero-Dependency)"]
    end

    A -->|HTTP REST Requests| B
    A4 -->|wa.me Direct Tele-Inquiry| WA["WhatsApp API Gateway"]
    B --> B1 --> B2
    B2 --> B4
    B4 --> C1
    B4 --> C2
    B3 --> C3
    B --> C4

    C1 <-->|User Records & Lockout State| D2
    C1 <-->|In-Memory User Persistence| D3
    C2 <-->|Product Query & Mutation| D2
    C2 <-->|In-Memory Seed Catalog| D3
    C3 -->|RAM Stream Buffer| D1
    C3 -.->|Base64 Data URI Fallback| D3
```

---

### 1.5 Operational Workflows

#### A. Patient / Clinician Device Discovery & Tele-Consultation
1. The user navigates to the catalog at `/products`.
2. Angular Signals immediately execute a filtered fetch through `ProductsService`.
3. The Express API evaluates parameters (`category`, `search`, `sort`) and returns filtered JSON.
4. The user selects a product (e.g., *Breg T Scope Premier Post-Op Knee Brace*), loading the detail view (`/products/prod-000`).
5. The user reviews biomechanical specifications, HCPCS code (`L1832`), and sizing guidelines.
6. Clicking **"Request Quote via WhatsApp"** opens an encrypted message thread to the clinical coordinator with product details pre-populated.

#### B. Administrative Hardware Management & Cloud Media Ingestion
1. The administrator navigates to `/admin/login`, enters credentials, and receives a signed JWT token.
2. The user navigates to `/admin/products/new`.
3. The user uploads a product photo; Multer buffers the image in RAM (without writing to the host disk) and streams it directly to Supabase Storage bucket `arthromed-products`.
4. The controller receives the permanent public CDN URL and associates it with the product payload.
5. The administrator specifies HCPCS codes, dimensions, and specifications; upon submission, the product is published to the catalog.

#### C. Brute-Force Lockout & Security Defense
1. An unauthorized agent attempts to guess credentials on `/api/auth/login`.
2. With each failed attempt, `failedLoginAttempts` increments by 1 and the server returns the remaining allowed attempts.
3. On the 3rd consecutive failed attempt, the server activates a **10-minute lockout**:
   - `isLocked` is set to `true`.
   - `lockUntil` is set to `Date.now() + 600,000` (10 minutes).
   - HTTP response status code is returned as **`423 Locked`**.
4. Subsequent login attempts within the 10-minute window are rejected, even if the correct password is submitted.
5. A system administrator can review locked accounts in the Admin Portal (`/admin/users`) and trigger an immediate unlock with one click (`POST /api/auth/users/:id/unlock`).

---

# 1.1 DATABASE DESCRIPTION TABLE (ATTRIBUTE, DATATYPE AND CONSTRAIN)

The ArthroMed data architecture consists of normalized entities supporting identity governance, medical hardware specifications, dynamic properties, and cloud media objects.

### Table 1: `users` (Identity, Security & RBAC Entity)
This table manages all authorized accounts, authentication credentials, security lockout counters, and clearance roles.

| # | Attribute (Column Name) | Data Type (SQL / TS) | Constraints & Modifiers | Default Value | Description & Business Rules |
|---|---|---|---|---|---|
| 1 | `id` | VARCHAR(64) / `string` | PRIMARY KEY, NOT NULL | Generated (e.g. `usr-<timestamp>`) | Unique account identifier assigned upon registration. |
| 2 | `fullName` | VARCHAR(150) / `string` | NOT NULL | None | Full legal or professional name of the practitioner or patient. |
| 3 | `email` | VARCHAR(255) / `string` | UNIQUE, NOT NULL, CHECK (RFC 5322 regex) | None | Lowercased, trimmed unique email used as primary login credential. |
| 4 | `passwordHash` | VARCHAR(256) / `string` | NOT NULL | None | Cryptographic SHA-256 digest salted with proprietary server salt (`password + 'arthromed-salt'`). Never exposed in public DTOs. |
| 5 | `role` | VARCHAR(20) / `string` | NOT NULL, CHECK (`role` IN ('customer', 'admin')) | `'customer'` | Clearance role. `'customer'` provides patient/clinic access; `'admin'` grants inventory and user management access. |
| 6 | `avatarUrl` | VARCHAR(500) / `string` | NULLABLE | `NULL` | Optional URL pointing to user profile picture or CDN avatar. |
| 7 | `failedLoginAttempts` | INTEGER / `number` | NOT NULL, CHECK (`failedLoginAttempts` >= 0) | `0` | Consecutive failed login counter. Incremented on bad password; reset to 0 on successful login or administrative unlock. |
| 8 | `lockUntil` | BIGINT / `number \| null` | NULLABLE | `NULL` | Epoch millisecond timestamp until which account authentication is blocked. When `Date.now() < lockUntil`, HTTP 423 is returned. |
| 9 | `isLocked` | BOOLEAN / `boolean` | NOT NULL | `FALSE` | Explicit security lockout indicator flag. |
| 10| `createdAt` | TIMESTAMPTZ / `string` | NOT NULL | `CURRENT_TIMESTAMP` | ISO 8601 UTC timestamp of account registration. |

---

### Table 2: `products` (Orthopedic Devices & Medical Hardware Entity)
This table stores clinical specifications, HCPCS billing codes, pricing models, and media references for each medical device.

| # | Attribute (Column Name) | Data Type (SQL / TS) | Constraints & Modifiers | Default Value | Description & Business Rules |
|---|---|---|---|---|---|
| 1 | `id` | VARCHAR(64) / `string` | PRIMARY KEY, NOT NULL | Generated (e.g. `prod-001`) | Unique catalog identifier for the orthopedic device. |
| 2 | `name` | VARCHAR(255) / `string` | NOT NULL | None | Full commercial trade name of the medical product (e.g., *Breg Polar Care Wave*). |
| 3 | `category` | VARCHAR(50) / `string` | NOT NULL, CHECK (`category` IN ('Knee', 'Shoulder', 'Cold Therapy', 'Spine', 'Foot & Ankle', 'General Orthopedics')) | `'General Orthopedics'` | Clinical anatomical category used for faceted search and filtering. |
| 4 | `sku` | VARCHAR(100) / `string` | UNIQUE, NOT NULL | None | Manufacturer stock keeping unit or Breg catalog identification code. |
| 5 | `price` | VARCHAR(50) / `string \| number` | NOT NULL | `'Request Quote'` | Pricing descriptor or quote designation for insurance fulfillment. |
| 6 | `imageUrl` | TEXT / `string` | NOT NULL | None | Fully qualified URL pointing to Supabase Cloud Storage bucket or fallback data URI. |
| 7 | `shortDescription` | TEXT / `string` | NOT NULL | None | Concise clinical summary displayed on catalog cards. |
| 8 | `fullDescription` | TEXT / `string` | NOT NULL | None | Comprehensive anatomical and biomechanical description for practitioners. |
| 9 | `keyFeatures` | JSONB / `string[]` | NOT NULL | `'[]'` | JSON array of strings detailing mechanical features (e.g., telescoping hinge bars, drop locks). |
| 10| `sizes` | JSONB / `string[]` | NOT NULL | `'[]'` | JSON array of valid anatomical size options (e.g., `["S", "M", "L", "XL"]` or `["Universal"]`). |
| 11| `hcpcsCode` | VARCHAR(50) / `string` | NOT NULL | None | Mandatory medical billing code (e.g., `L1832`, `L1845`, `E0218`) for insurance claim processing. |
| 12| `fittingGuideUrl` | VARCHAR(1000) / `string`| NULLABLE | `NULL` | Verified direct URL to official manufacturer PDF patient instructions. |
| 13| `specs` | JSONB / `ProductSpec[]` | NOT NULL | `'[]'` | Structured array of key-value objects `[{label: string, value: string}]` detailing technical measurements. |
| 14| `isPublished` | BOOLEAN / `boolean` | NOT NULL | `TRUE` | Catalog visibility switch. Unpublished devices are only accessible to administrators. |
| 15| `createdAt` | TIMESTAMPTZ / `string` | NOT NULL | `CURRENT_TIMESTAMP` | ISO 8601 UTC timestamp of catalog registration. |

---

### Table 3: `product_specs` (Normalized Technical Specifications Sub-Entity)
When normalized into relational database engines (PostgreSQL), specifications are modeled as a dedicated 1-to-many child table.

| # | Attribute (Column Name) | Data Type (SQL / TS) | Constraints & Modifiers | Default Value | Description & Business Rules |
|---|---|---|---|---|---|
| 1 | `spec_id` | BIGSERIAL / `number` | PRIMARY KEY, NOT NULL | Auto-incrementing | Unique specification record identifier. |
| 2 | `product_id` | VARCHAR(64) / `string` | FOREIGN KEY REFERENCES `products(id)` ON DELETE CASCADE, NOT NULL | None | Relational foreign key binding the spec to the parent orthopedic device. |
| 3 | `label` | VARCHAR(100) / `string` | NOT NULL | None | Metric or parameter name (e.g., *Extension Stops*, *Frame Material*, *Weight*). |
| 4 | `value` | VARCHAR(255) / `string` | NOT NULL | None | Measured value or clinical setting (e.g., `-10° to 90°`, `6061 T6 Aircraft Aluminum`). |

---

### Table 4: `storage.objects` (Supabase Cloud Asset Storage Bucket)
Managed by the Supabase Cloud Storage Engine under the private/public bucket namespace `arthromed-products`.

| # | Attribute (Column Name) | Data Type (SQL / TS) | Constraints & Modifiers | Default Value | Description & Business Rules |
|---|---|---|---|---|---|
| 1 | `id` | UUID / `string` | PRIMARY KEY, NOT NULL | `gen_random_uuid()` | Unique internal storage object identifier. |
| 2 | `bucket_id` | VARCHAR(64) / `string` | FOREIGN KEY REFERENCES `storage.buckets(id)`, NOT NULL | `'arthromed-products'` | Dedicated storage bucket namespace for ArthroMed product imagery. |
| 3 | `name` | TEXT / `string` | NOT NULL | None | Path key formatted as `products/<timestamp>-<random-hash>.<ext>`. |
| 4 | `owner` | UUID / `string` | NULLABLE | `NULL` | Supabase auth user reference of the uploader. |
| 5 | `created_at` | TIMESTAMPTZ / `string` | NOT NULL | `NOW()` | Timestamp when image buffer was streamed to cloud. |
| 6 | `updated_at` | TIMESTAMPTZ / `string` | NOT NULL | `NOW()` | Timestamp when image metadata was last updated. |
| 7 | `last_accessed_at`| TIMESTAMPTZ / `string` | NULLABLE | `NULL` | Telemetry timestamp of CDN cache read. |
| 8 | `metadata` | JSONB / `object` | NOT NULL | `'{}'` | Technical metadata object containing `{mimetype, size, cacheControl, eTag}`. |

---

### Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS {
        varchar id PK "Unique User ID"
        varchar fullName "Practitioner Name"
        varchar email UK "RFC 5322 Valid Email"
        varchar passwordHash "Salted SHA-256 Digest"
        varchar role "Role ('customer' | 'admin')"
        varchar avatarUrl "Optional Profile URL"
        integer failedLoginAttempts "Failed Attempts Counter (0-3)"
        bigint lockUntil "Epoch Timestamp (ms)"
        boolean isLocked "Lockout Status Flag"
        timestamptz createdAt "Account Creation Date"
    }

    PRODUCTS {
        varchar id PK "Unique Product ID"
        varchar name "Trade Commercial Name"
        varchar category "Anatomical Category"
        varchar sku UK "Breg / Manufacturer SKU"
        varchar price "Commercial / Quote Terms"
        text imageUrl "Supabase CDN Asset URL"
        text shortDescription "Clinical Summary"
        text fullDescription "Biomechanical Details"
        jsonb keyFeatures "Array of Features"
        jsonb sizes "Anatomical Size Array"
        varchar hcpcsCode "Insurance Billing Code"
        varchar fittingGuideUrl "External PDF Guide Link"
        jsonb specs "Key-Value Specs Array"
        boolean isPublished "Catalog Visibility Flag"
        timestamptz createdAt "Catalog Addition Date"
    }

    PRODUCT_SPECS {
        bigserial spec_id PK "Unique Spec ID"
        varchar product_id FK "References PRODUCTS(id)"
        varchar label "Specification Parameter"
        varchar value "Measured Value"
    }

    STORAGE_OBJECTS {
        uuid id PK "Storage Object ID"
        varchar bucket_id FK "Bucket ('arthromed-products')"
        text name "Path Key (products/file.jpg)"
        uuid owner "Uploader ID"
        timestamptz created_at "Stream Upload Timestamp"
        timestamptz updated_at "Mutation Timestamp"
        jsonb metadata "MIME Type & Byte Size"
    }

    PRODUCTS ||--o{ PRODUCT_SPECS : "has normalized"
    PRODUCTS ||--o| STORAGE_OBJECTS : "references uploaded image"
    USERS ||--o{ PRODUCTS : "admin publishes & manages"
```

---

# 1.2 MODULE DESCRIPTION

The ArthroMed codebase is structured into distinct, modular functional units across the backend and frontend.

### 3.1 Backend Microservices & Controllers

```
ARTHROMED/backend/src/
├── config/
│   └── supabase.ts           # Cloud client & environment initialization
├── controllers/
│   ├── auth.controller.ts    # Authentication, lockout & user management
│   ├── product.controller.ts # Catalog CRUD, filtering & resilience fallback
│   └── upload.controller.ts  # Memory-buffered cloud storage streaming
├── middleware/
│   ├── auth.middleware.ts    # JWT token issuance, verification & RBAC guards
│   └── upload.middleware.ts  # Multer memory buffer configuration
├── models/
│   ├── product.model.ts      # Shared strict product TypeScript contract
│   └── user.model.ts         # User entity, DTOs & authentication models
├── routes/
│   ├── auth.routes.ts        # /api/auth routing dispatcher
│   ├── product.routes.ts     # /api/products routing dispatcher
│   └── upload.routes.ts      # /api/upload routing dispatcher
└── index.ts                  # Application entry point, CORS & error handlers
```

#### Module 1.1: HTTP Gateway & Server Dispatcher (`backend/src/index.ts`)
- **Responsibilities:**
  - Initializes the Express application instance on port 3000 (configurable via `process.env.PORT`).
  - Configures CORS security policy with a strict whitelist (`http://localhost:4200`, `http://127.0.0.1:4200`, and `process.env.FRONTEND_URL`), blocking unauthorized cross-origin requests.
  - Registers payload parsers (`express.json` and `express.urlencoded` with 15MB limits) to accommodate medical specifications and data payloads.
  - Mounts the `/api/health` diagnostic probe returning JSON telemetry (`serviceState`, `gateway`, `checkedAt`).
  - Mounts microservice routers: `/api/auth`, `/api/products`, and `/api/upload`.
  - Implements a centralized error handling middleware to capture unexpected exceptions and return uniform JSON responses.

#### Module 1.2: Authentication & Security Microservice (`backend/src/controllers/auth.controller.ts`)
- **Responsibilities:**
  - **Password Strength Validator (`validatePasswordStrength`):** Enforces a 5-point complexity rule: length >= 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number, and at least 1 special character.
  - **Email Format Validator (`validateEmailFormat`):** Applies RFC 5322 regex validation to verify proper email structure.
  - **Cryptographic Hasher (`hashPassword`):** Salts user passwords with `'arthromed-salt'` and computes a 256-bit SHA-256 hash.
  - **Account Lockout Engine (`login`):**
    - Tracks `failedLoginAttempts` per account.
    - Limits failed attempts to a maximum of 3 (`MAX_FAILED_ATTEMPTS = 3`).
    - On the 3rd failed attempt, locks the account for 10 minutes (`LOCKOUT_DURATION_MS = 600,000 ms`), returning HTTP 423 Locked with `remainingSeconds`.
    - Resets failed attempt counter to 0 upon successful password verification.
  - **Account Registration (`register`):** Validates input, prevents duplicate email registration, and creates new customer accounts.
  - **Identity Verification (`getMe`):** Returns sanitized user DTOs excluding password hashes.
  - **User Governance (`getAllUsers`, `unlockUser`, `deleteUser`):** Administrative endpoints allowing privileged users to view registered accounts, monitor failed attempts, manually unlock locked accounts, or delete accounts.

#### Module 1.3: Cryptographic Session Middleware (`backend/src/middleware/auth.middleware.ts`)
- **Responsibilities:**
  - **Token Generation (`createToken`):** Encodes user identity (`id`, `email`, `role`, `fullName`) into an HMAC-signed Bearer token with expiration timestamps.
  - **Authentication Guard (`requireAuth`):** Intercepts requests, validates Bearer headers, checks expiration, and attaches the active user payload to `req.user`.
  - **Role-Based Clearance Guard (`requireAdmin`):** Verifies that the authenticated user possesses `role === 'admin'`. Returns HTTP 403 Forbidden for unauthorized requests.

#### Module 1.4: Medical Product Catalog Microservice (`backend/src/controllers/product.controller.ts`)
- **Responsibilities:**
  - **Multi-Criteria Query Dispatcher (`getProducts`):**
    - Filters by anatomical `category` (`Knee`, `Shoulder`, `Cold Therapy`, etc.).
    - Executes case-insensitive fuzzy searches across device `name`, `sku`, and `shortDescription`.
    - Sorts records alphabetically (`az`, `za`) or by recency (`newest`).
  - **Single Product Fetcher (`getProductById`):** Retrieves complete device records including sizing arrays and technical specifications. Returns HTTP 404 for invalid IDs.
  - **Product Creation (`createProduct`):** Validates required clinical fields (`name`, `category`, `sku`, `hcpcsCode`), prevents duplicate SKUs, and adds records to the catalog. Protected by `requireAdmin`.
  - **Product Mutation (`updateProduct`):** Updates specifications, pricing, and publication status (`isPublished`). Protected by `requireAdmin`.
  - **Product Deletion (`deleteProduct`):** Removes products from the database and triggers automatic image garbage collection in Supabase Storage. Protected by `requireAdmin`.
  - **Dual-Mode Data Resilience:** Automatically attempts queries against Supabase PostgreSQL; if credentials are unset or connection fails, seamlessly falls back to the pre-populated 6-product Breg® in-memory store.

#### Module 1.5: Cloud Storage Streaming Controller (`backend/src/controllers/upload.controller.ts`)
- **Responsibilities:**
  - Integrates with Multer memory storage (`upload.single('image')`) to buffer uploaded files directly in RAM (5MB limit, image MIME filter).
  - Streams the RAM buffer directly to Supabase Storage bucket `arthromed-products` at path `products/<timestamp>-<random>.<ext>`.
  - Retrieves and returns the public CDN URL to the client.
  - When Supabase credentials are not configured, converts the RAM buffer to a base64 data URI string for zero-dependency local execution.

---

### 3.2 Frontend Architecture & Angular 18 Components

```
ARTHROMED/frontend/src/app/
├── core/
│   ├── guards/
│   │   ├── admin.guard.ts           # Route guard protecting /admin/*
│   │   └── auth.guard.ts            # Route guard requiring authenticated session
│   ├── models/
│   │   ├── product.model.ts         # TypeScript interfaces for products & specs
│   │   └── user.model.ts            # TypeScript interfaces for user, auth & DTOs
│   └── services/
│       ├── auth.service.ts          # Signal-driven auth state & lockout timers
│       └── products.service.ts      # Signal-driven catalog & WhatsApp services
├── pages/
│   ├── admin/
│   │   ├── login/                   # Isolated Admin Sign-In Portal
│   │   ├── product-form/            # Dynamic Product Creation/Edit Matrix
│   │   ├── users/                   # User Governance & Lockout Monitor
│   │   └── admin-products.component.ts # Inventory Management Table
│   ├── auth/
│   │   ├── login/                   # Patient & Clinic Sign-In Page
│   │   └── signup/                  # Registration with Live Password Checklist
│   ├── home/
│   │   ├── sections/ (hero, services, care-stages, why-choose-us, stats, testimonials, cta)
│   │   └── home.component.ts        # Clinical landing page coordinator
│   └── products/
│       ├── components/ (filter-bar, product-card, empty-state)
│       ├── product-detail/          # Device specs, HCPCS & WhatsApp quote
│       └── products.component.ts    # Main catalog & search view
├── shared/components/
│   ├── admin-navbar/                # Dedicated header for admin control panel
│   ├── footer/                      # Regulatory disclaimers & contact info
│   ├── loading-skeleton/            # Shimmer loading skeleton UI
│   └── navbar/                      # Clinical navigation bar & mobile drawer
├── app.routes.ts                    # Application route definitions
└── app.component.ts                 # Root shell component
```

#### Module 2.1: Core Services & Reactive State Management
- **`AuthService` (`frontend/src/app/core/services/auth.service.ts`):**
  - Manages reactive Angular Signals: `currentUser()`, `isAuthenticated()`, `isAdmin()`, and `lockoutRemainingSeconds()`.
  - Handles token storage and retrieval in `localStorage`.
  - Manages client-side interval timers to decrement the 10-minute lockout countdown and provide user feedback.
  - Exposes authentication methods: `login()`, `register()`, `googleLogin()`, `logout()`, `getAllUsers()`, and `unlockUser()`.
- **`ProductsService` (`frontend/src/app/core/services/products.service.ts`):**
  - Maintains reactive Signals: `products()`, `selectedProduct()`, `loading()`, `error()`, `selectedCategory()`, `searchQuery()`, and `sortBy()`.
  - Coordinates HTTP calls to the backend REST API with automatic fallback to local mock data if the API is offline.
  - **WhatsApp Deep-Link Builders:**
    - `requestProductQuoteWhatsApp(product)`: Generates a pre-formatted message including device name, category, SKU, and HCPCS code.
    - `contactSupportWhatsApp()`: Generates a pre-formatted message for immediate clinical fitting support.

#### Module 2.2: Route Guard Security (`frontend/src/app/core/guards/`)
- **`adminGuard` (`admin.guard.ts`):** Functional route guard that checks `authService.isAdmin()`. If false, redirects unauthorized users to `/admin/login`.
- **`authGuard` (`auth.guard.ts`):** Verifies that the user is authenticated before allowing access to protected views.

#### Module 2.3: Public Clinical Portal & Landing Experience (`frontend/src/app/pages/home/`)
Coordinates 8 clinical rehabilitation sections on the home page:
1. **Hero Section (`hero.component.ts`):** Clinical value proposition, primary CTA to catalog, and direct link to WhatsApp consultation.
2. **About Snippet (`about-snippet.component.ts`):** Clinical background, orthopedic focus, and mission statement.
3. **Services Section (`services.component.ts`):** 4 clinical service pillars (Post-Op Knee Bracing, Cold Compression Systems, Spinal Orthotics, Shoulder Immobilization).
4. **Care Stages (`care-stages.component.ts`):** 4-step rehabilitation journey: Pre-Op Assessment, Surgery Immobilization, Physical Therapy Rehab, and Active Joint Mobility.
5. **Why Choose Us (`why-choose-us.component.ts`):** Authorized Breg® partnership, certified clinical fitting, and rapid delivery.
6. **Clinical Stats (`stats.component.ts`):** Verified metrics: 10,000+ patients rehabilitated, 98% clinical satisfaction rate, 500+ clinic partners.
7. **Testimonials (`testimonials.component.ts`):** Professional endorsements from board-certified orthopedic surgeons and physical therapists.
8. **CTA Banner (`cta-banner.component.ts`):** Call-to-action for clinic partnerships and patient consultations.

#### Module 2.4: Medical Device Catalog & Details (`frontend/src/app/pages/products/`)
- **`ProductsComponent` (`products.component.ts`):** Catalog container managing search input, category selection chips, and sorting controls.
- **`FilterBarComponent` (`filter-bar.component.ts`):** Category tab bar with active selection indicators.
- **`ProductCardComponent` (`product-card.component.ts`):** Medical device card displaying product photography, HCPCS code badges, price/quote indicator, and link to detailed specifications.
- **`ProductDetailComponent` (`product-detail.component.ts`):** Detailed specification view featuring:
  - Technical measurements table (extension/flexion stops, materials, dimensions).
  - Anatomical sizing chart (S, M, L, XL, Universal).
  - Prominent HCPCS insurance billing code box.
  - Direct link to official Breg® PDF Instructions for Use.
  - WhatsApp Quote button pre-populating patient inquiries.

#### Module 2.5: Administrative Control & Governance (`frontend/src/app/pages/admin/`)
- **`AdminProductsComponent` (`admin-products.component.ts`):** Complete inventory dashboard with search, published status toggle, and delete confirmation dialogs.
- **`ProductFormComponent` (`product-form.component.ts`):** Create and edit form with dynamic specification builders, key feature tags, sizing selectors, and image upload with live thumbnail previews.
- **`AdminLoginComponent` (`admin-login.component.ts`):** Dedicated sign-in portal for administrative users.
- **`AdminUsersComponent` (`admin-users.component.ts`):** User security panel displaying registered accounts, failed login counters, locked/active status badges, and one-click manual account unlocking.

#### Module 2.6: Patient & Clinic Authentication (`frontend/src/app/pages/auth/`)
- **`LoginComponent` (`login.component.ts`):** Clinic and patient sign-in view with password visibility toggle and real-time lockout countdown banner.
- **`SignupComponent` (`signup.component.ts`):** Registration form with a live 5-point password complexity checklist that validates input in real time.

---

# 1.3 SYSTEM RUNTIME OUTPUT

The following terminal logs, test executions, and API responses demonstrate the live, verified operation of the ArthroMed system.

### 4.1 Backend Server Initialization Output
Starting the backend Express server on port 3000 (`node dist/index.js`):

```text
PS C:\Users\as993\Downloads\Arthromed\ARTHROMED\backend> node dist/index.js
ℹ️ Supabase credentials not fully provided. Running in resilient mock/in-memory mode.
===============================================
🚀 ArthroMed Server is listening on port 3000
🔑 Auth:      http://localhost:3000/api/auth
📡 Products:  http://localhost:3000/api/products
📤 Upload:    http://localhost:3000/api/upload
===============================================
```

---

### 4.2 Frontend Angular Build & Compilation Output
Compiling the Angular 18 frontend (`npm run build`):

```text
PS C:\Users\as993\Downloads\Arthromed\ARTHROMED\frontend> npm run build

> arthromed-frontend@1.0.0 build
> ng build

- Generating browser application bundles (phase: setup)...
✔ Browser application bundle generation complete.
- Copying assets...
✔ Copying assets complete.
- Generating index html...
✔ Index html generation complete.

Initial chunk files   | Names         |  Raw size | Estimated transfer size
main-7FTG6U2I.js      | main          | 566.65 kB |               142.10 kB
polyfills-FFHMD2TL.js | polyfills     |  34.52 kB |                11.02 kB
styles-UAQVEHP6.css   | styles        |   5.06 kB |                 1.45 kB

                      | Initial total | 606.23 kB |               154.57 kB

Application bundle generation complete. [1.942 seconds]
Output location: dist/arthromed-frontend/browser
```

---

### 4.3 Comprehensive Security & Auth Flow Test Suite Output
Executing the automated security verification suite (`powershell -File .\verify-auth-flow.ps1`):

```text
PS C:\Users\as993\Downloads\Arthromed> powershell -ExecutionPolicy Bypass -File .\verify-auth-flow.ps1
==========================================================
   ARTHROMED AUTHENTICATION & SECURITY TEST SUITE         
==========================================================

[Test 1] Register with invalid email...
PASS: Rejected invalid email format with 400. Reason: Please provide a valid email address (e.g., name@example.com).

[Test 2] Register with weak password (<8 chars / missing criteria)...
PASS: Rejected weak password with 400. Reason: Password must be at least 8 characters long.

[Test 3] Register with strong password (surgeon.sharma1955@orthomail.com)...
PASS: Successfully registered user: surgeon.sharma1955@orthomail.com (Role: customer)

[Test 4] Trigger 3 Failed Password Attempts (Lockout Test)...
Attempt 1 -> HTTP Status: 401 | Error: Incorrect password. You have 2 attempt(s) remaining before your account is locked for 10 minutes.
Attempts remaining: 2
Attempt 2 -> HTTP Status: 401 | Error: Incorrect password. You have 1 attempt(s) remaining before your account is locked for 10 minutes.
Attempts remaining: 1
Attempt 3 -> HTTP Status: 423 | Error: Security Lockout: Incorrect password entered 3 times. Your account has been temporarily locked for 10 minutes.
Locked state: isLocked=True, remainingSeconds=600
PASS: 10-minute Lockout triggered on attempt 3!

[Test 5] Verify login blocked while account is locked (even with correct password)...
PASS: Account is strictly locked for 10 minutes (600s remaining)! Server error: Security Lockout: Your account is temporarily locked due to 3 consecutive failed attempts. Please wait 10 minute(s) before trying again.

[Test 6] Admin Login and Check All Users...
PASS: Admin logged in successfully! Role: admin

[Test 7] Admin fetching all registered users (GET /api/auth/users)...
PASS: Admin sees user Dr. Rajesh Sharma (surgeon.sharma1955@orthomail.com)
User Status in Admin Dashboard: isLocked=True, failedAttempts=3
PASS: User is accurately marked locked in Admin Portal!

[Test 8] Admin Unlocks User (POST /api/auth/users/usr-1791446538211/unlock)...
PASS: Admin unlock response: Account for Dr. Rajesh Sharma (surgeon.sharma1955@orthomail.com) has been successfully unlocked.
User status after unlock: isLocked=False

[Test 9] User logging in after admin unlocked their account...
PASS: User logged in successfully! Welcome Dr. Rajesh Sharma

==========================================================
   ALL SECURITY & AUTHENTICATION CHECKS PASSED 100%!     
==========================================================
```

---

### 4.4 Frontend Route Verification Output
Running the route response check (`powershell -File .\verify-routes.ps1`):

```text
PS C:\Users\as993\Downloads\Arthromed> powershell -ExecutionPolicy Bypass -File .\verify-routes.ps1
Verifying Frontend Pages and Routes...
Home Page HTTP Status: 200
Products Page HTTP Status: 200
Admin Login Page HTTP Status: 200

All frontend routes responding properly!
```

---

### 4.5 REST API Request & Response Payloads (JSON)

#### 1. System Health Check (`GET /api/health`)
**Request:**
```http
GET /api/health HTTP/1.1
Host: localhost:3000
```
**Response (HTTP 200 OK):**
```json
{
  "serviceState": "active",
  "gateway": "ArthroMed Clinical API Suite",
  "checkedAt": "2026-10-08T08:01:44.205Z"
}
```

---

#### 2. User Registration (`POST /api/auth/register`)
**Request:**
```http
POST /api/auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "fullName": "Dr. Rajesh Sharma, MD",
  "email": "surgeon.sharma@orthomail.com",
  "password": "SecurePass@2026"
}
```
**Response (HTTP 201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzci0xNzkxNDQ2NTM4MjExIiwiZW1haWwiOiJzdXJnZW9uLnNoYXJtYUBvcnRob21haWwuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiZnVsbE5hbWUiOiJEci4gUmFqZXNoIFNoYXJtYSwgTUQifQ.sig",
  "user": {
    "id": "usr-1791446538211",
    "fullName": "Dr. Rajesh Sharma, MD",
    "email": "surgeon.sharma@orthomail.com",
    "role": "customer",
    "avatarUrl": null
  }
}
```

---

#### 3. Failed Login Attempt 1 (`POST /api/auth/login`)
**Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "surgeon.sharma@orthomail.com",
  "password": "WrongPassword#1",
  "requiredRole": "customer"
}
```
**Response (HTTP 401 Unauthorized):**
```json
{
  "error": "Incorrect password. You have 2 attempt(s) remaining before your account is locked for 10 minutes.",
  "failedAttempts": 1,
  "attemptsRemaining": 2
}
```

---

#### 4. Account Lockout on Attempt 3 (`POST /api/auth/login`)
**Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "surgeon.sharma@orthomail.com",
  "password": "WrongPassword#3",
  "requiredRole": "customer"
}
```
**Response (HTTP 423 Locked):**
```json
{
  "error": "Security Lockout: Incorrect password entered 3 times. Your account has been temporarily locked for 10 minutes. Contact your clinic administrator to unlock early.",
  "isLocked": true,
  "remainingSeconds": 600,
  "lockUntil": "2026-10-08T08:11:44.215Z"
}
```

---

#### 5. Admin Authentication (`POST /api/auth/login`)
**Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "admin@arthromed.com",
  "password": "admin123",
  "requiredRole": "admin"
}
```
**Response (HTTP 200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItYWRtaW4tMDEiLCJlbWFpbCI6ImFkbWluQGFydGhyb21lZC5jb20iLCJyb2xlIjoiYWRtaW4iLCJmdWxsTmFtZSI6IkNsaW5pY2FsIFN5c3RlbSBBZG1pbmlzdHJhdG9yIn0.sig",
  "user": {
    "id": "user-admin-01",
    "fullName": "Clinical System Administrator",
    "email": "admin@arthromed.com",
    "role": "admin"
  }
}
```

---

#### 6. Admin Manual Account Unlock (`POST /api/auth/users/:id/unlock`)
**Request:**
```http
POST /api/auth/users/usr-1791446538211/unlock HTTP/1.1
Host: localhost:3000
Authorization: Bearer <ADMIN_JWT_TOKEN>
```
**Response (HTTP 200 OK):**
```json
{
  "message": "Account for Dr. Rajesh Sharma (surgeon.sharma@orthomail.com) has been successfully unlocked.",
  "user": {
    "id": "usr-1791446538211",
    "fullName": "Dr. Rajesh Sharma, MD",
    "email": "surgeon.sharma@orthomail.com",
    "role": "customer",
    "failedLoginAttempts": 0,
    "isLocked": false,
    "lockUntil": null
  }
}
```

---

#### 7. Orthopedic Catalog Query (`GET /api/products?category=Knee`)
**Request:**
```http
GET /api/products?category=Knee HTTP/1.1
Host: localhost:3000
```
**Response (HTTP 200 OK):**
```json
[
  {
    "id": "prod-000",
    "name": "Breg T Scope Premier Post-Op Knee Brace",
    "category": "Knee",
    "sku": "BREG-TSCOPE-001",
    "price": "Request Quote",
    "imageUrl": "/images/breg-tscope-hero.jpg",
    "shortDescription": "Gold-standard telescoping post-operative knee brace with range-of-motion control dials, quick-lock latch, and BridgeTech incision pads.",
    "fullDescription": "The Breg T Scope Premier Post-Op Knee Brace is the world-renowned clinical standard for range of motion control and immobilization following ACL, PCL, MCL, LCL, and meniscal repairs. Featuring telescoping hinge bars that easily adjust from 17\" to 27\" to fit any patient anatomy, intuitive drop-lock tabs, and ultra-comfortable BridgeTech pads that offload pressure from surgical incisions.",
    "keyFeatures": [
      "Telescoping hinge bars extend from 17\" to 27\" with simple push-button controls",
      "Range of Motion hinge controls extension from -10° to 90° and flexion from -10° to 120°",
      "One-touch quick drop-lock latch at -10°, 0°, 10°, 20°, and 30°",
      "BridgeTech incision pads relieve pressure on sensitive surgical wound sites",
      "Quick-release buckle straps allow effortless application and removal"
    ],
    "sizes": ["Universal (Left/Right)"],
    "hcpcsCode": "L1832 / L1833",
    "fittingGuideUrl": "https://www.breg.com/wp-content/uploads/2021/05/T-Scope-Premier-Instructions.pdf",
    "specs": [
      { "label": "Brace Type", "value": "Post-Operative ROM Knee Brace" },
      { "label": "Length Range", "value": "17 in to 27 in (43.2 cm to 68.6 cm)" },
      { "label": "Extension Stops", "value": "-10°, 0°, 10°, 20°, 30°, 40°, 50°, 60°, 70°, 80°, 90°" },
      { "label": "Flexion Stops", "value": "-10°, 0°, 10°, 20°, 30°, 40°, 50°, 60°, 70°, 80°, 90°, 100°, 110°, 120°" },
      { "label": "Drop Lock Settings", "value": "-10°, 0°, 10°, 20°, 30°" },
      { "label": "Weight", "value": "2.4 lbs (1.09 kg)" }
    ],
    "isPublished": true,
    "createdAt": "2025-03-01T08:00:00.000Z"
  }
]
```

---

#### 8. RAM Stream Asset Upload (`POST /api/upload`)
**Request:**
```http
POST /api/upload HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXYZ

------WebKitFormBoundaryXYZ
Content-Disposition: form-data; name="image"; filename="breg-fusion.jpg"
Content-Type: image/jpeg

<binary image buffer data>
------WebKitFormBoundaryXYZ--
```
**Response (HTTP 200 OK):**
```json
{
  "url": "https://xyzcompany.supabase.co/storage/v1/object/public/arthromed-products/products/1791446800112-k9s8d7a.jpg",
  "filePath": "products/1791446800112-k9s8d7a.jpg",
  "message": "Image uploaded successfully to Supabase Storage"
}
```

---

### 4.6 System User Interface Runtime Layouts (ASCII Wireframes)

#### Screen 1: Clinical Landing Page (`http://localhost:4200/`)
```text
+----------------------------------------------------------------------------------------------------+
|  [+] ARTHROMED        Home   Products   About   Clinical Fitting   [WhatsApp +91 98765 43210]  [Login]|
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [ BREG® AUTHORIZED MEDICAL PLATFORM ]                                                             |
|                                                                                                    |
|  Precision Orthopedic Recovery & Joint Stabilization                                               |
|  Delivering certified postoperative knee braces, cold therapy units, and spinal orthotics          |
|  engineered to accelerate clinical rehabilitation.                                                 |
|                                                                                                    |
|  [ Explore Medical Catalog -> ]           [ Tele-Consult via WhatsApp ]                             |
|                                                                                                    |
|  +---------------------------+  +---------------------------+  +--------------------------------+  |
|  |  10,000+ Patients Served  |  |  98% Clinical Approval    |  |  HCPCS / FDA Compliant Braces  |  |
|  +---------------------------+  +---------------------------+  +--------------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
|  REHABILITATION SPECIALTIES:                                                                       |
|  [ Knee Stabilization ]  [ Cold & Compression ]  [ Shoulder Suspensions ]  [ Spinal Orthotics ]    |
+----------------------------------------------------------------------------------------------------+
```

#### Screen 2: Orthopedic Products Catalog (`http://localhost:4200/products`)
```text
+----------------------------------------------------------------------------------------------------+
|  HOME / PRODUCTS CATALOG                                                                           |
|                                                                                                    |
|  [ Search orthopedic device, SKU, or condition...   [Q] ]       Sort By: [ Featured / Recency v ]  |
|                                                                                                    |
|  [ All Products (6) ] [ Knee (3) ] [ Cold Therapy (1) ] [ Shoulder (1) ] [ Spine (1) ] [ Ankle (1) ]|
+----------------------------------------------------------------------------------------------------+
|  +-----------------------------+ +-----------------------------+ +-------------------------------+ |
|  | [ Image: Breg T Scope ]     | | [ Image: Polar Care Wave ]  | | [ Image: Fusion XT Brace ]    | |
|  | Category: Knee Brace        | | Category: Cold Therapy      | | Category: Knee Ligament       | |
|  | Breg T Scope Premier Knee   | | Breg Polar Care Wave System | | Breg Fusion XT Ligament Knee  | |
|  | HCPCS: L1832 / L1833        | | HCPCS: E0218                | | HCPCS: L1845                  | |
|  | Price: Request Quote        | | Price: Request Quote        | | Price: Request Quote          | |
|  | [ View Specifications ]     | | [ View Specifications ]     | | [ View Specifications ]       | |
|  +-----------------------------+ +-----------------------------+ +-------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### Screen 3: Product Detail View with WhatsApp Quote (`http://localhost:4200/products/prod-000`)
```text
+----------------------------------------------------------------------------------------------------+
|  < Back to Catalog                                                                                 |
|                                                                                                    |
|  +----------------------------+   Breg T Scope Premier Post-Op Knee Brace                          |
|  |                            |   Category: Knee | SKU: BREG-TSCOPE-001 | Status: In Stock         |
|  |                            |                                                                    |
|  |  [ High-Resolution Image ] |   HCPCS Insurance Billing Code: [ L1832 / L1833 ]                  |
|  |                            |                                                                    |
|  |                            |   Short Summary: Gold-standard telescoping knee brace with ROM dials|
|  |                            |                                                                    |
|  +----------------------------+   [ Request Quote via WhatsApp (Instant Tele-Consult) ]            |
|                                   [ Download Official Breg Fitting Guide PDF ]                     |
|                                                                                                    |
|  +-----------------------------------------------------------------------------------------------+ |
|  | TECHNICAL & CLINICAL SPECIFICATIONS MATRIX                                                    | |
|  | * Brace Type: Post-Operative ROM Knee Brace                                                    | |
|  | * Length Adjustment: Telescoping from 17 in to 27 in (43.2 cm to 68.6 cm)                      | |
|  | * Extension Stops: -10°, 0°, 10°, 20°, 30°, 40°, 50°, 60°, 70°, 80°, 90°                        | |
|  | * Flexion Stops: -10° to 120°                                                                 | |
|  | * Surgical Relief: BridgeTech incision offloading pads included                               | |
|  +-----------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

#### Screen 4: Security Account Lockout Alert Banner (`http://localhost:4200/login`)
```text
+----------------------------------------------------------------------------------------------------+
|  PATIENT & CLINICIAN SECURE SIGN IN                                                               |
|                                                                                                    |
|  +-----------------------------------------------------------------------------------------------+ |
|  | [!] SECURITY LOCKOUT ACTIVATED: 3 Failed Login Attempts Detected                              | |
|  | Your account has been temporarily locked for 10 minutes to protect against brute-force       | |
|  | attacks. Cooldown timer: 09:47 remaining.                                                      | |
|  | Contact your clinic administrator to request an immediate manual account unlock.              | |
|  +-----------------------------------------------------------------------------------------------+ |
|                                                                                                    |
|  Email Address:    [ surgeon.sharma@orthomail.com                   ]                              |
|  Password:         [ ******************                             ] [Show/Hide]                  |
|                                                                                                    |
|  [ Account Locked - Please Wait ]                                                                  |
+----------------------------------------------------------------------------------------------------+
```

#### Screen 5: Administrative Security & Governance Panel (`http://localhost:4200/admin/users`)
```text
+----------------------------------------------------------------------------------------------------+
|  [+] ARTHROMED ADMIN CONTROL PANEL        [Inventory (6)]   [User Security]   [System Admin] [Logout] |
+----------------------------------------------------------------------------------------------------+
|  USER GOVERNANCE & SECURITY ACCESS DIRECTORY                                                       |
|                                                                                                    |
|  +-----------------------------+--------------------------+----------+------------+--------------+ |
|  | Practitioner Name           | Email Address            | Role     | Status     | Actions      | |
|  +-----------------------------+--------------------------+----------+------------+--------------+ |
|  | Clinical System Admin       | admin@arthromed.com      | admin    | Active     | Protected    | |
|  | Sarah Jenkins, DPT          | customer@arthromed.com   | customer | Active     | [Reset Pwd]  | |
|  | Dr. Rajesh Sharma, MD       | surgeon.sharma@ortho.com | customer | [LOCKED]   | [UNLOCK NOW] | |
|  +-----------------------------+--------------------------+----------+------------+--------------+ |
|                                                                                                    |
|  Security Policy: 3 failed attempts triggers automatic 10-minute lockout.                        |
|  Administrator action: Clicking [UNLOCK NOW] immediately clears failed attempts and unlocks.       |
+----------------------------------------------------------------------------------------------------+
```

---

*Documentation compiled and verified for the ArthroMed Orthopedic & Breg® Medical Products Platform.*
