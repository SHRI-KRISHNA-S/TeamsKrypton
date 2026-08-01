# 🎓 College Club & Community Management Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62B)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An enterprise-grade, full-stack collaborative platform designed to streamline student club registrations, event management, and campus-wide networking. The portal automates membership requests, tracks participation via verifiable attendance, awards transaction-backed activity points, and aggregates real-time engagement analytics. By replacing outdated paper-based operations with a secure, responsive digital workspace, it enhances overall campus collaboration, student visibility, and administrative control.

---

## 📌 Project Overview

This project addresses the fragmentation, lack of visibility, and manual friction typical of college club activities. 

* **Why it exists**: Clubs are the heartbeat of campus life, yet scheduling conflicts, manual paper registries, and untracked student participation prevent clubs from reaching their full potential.
* **Problems with manual club management**: Paper-based registration leads to high churn, QR or attendance logs are easily spoofed, and administrators lack verified metrics on student involvement.
* **How this portal improves engagement**: Provides a unified, live portal connecting all clubs, student resumes, and notifications.
* **Why it is different**: Features a transaction-based **Activity Points (AP)** engine, **verifiable certificate hash auditing**, and **multi-channel role guards** tailored explicitly for university structures.

---

## ⚙️ Project Architecture

```mermaid
graph TD
  A["Frontend (React + Vite + Tailwind)"]
  B["Express Gateway (Node.js + TypeScript)"]
  C["JWT Auth & Role Guards (RBAC)"]
  D["Prisma ORM Client"]
  E["Supabase PostgreSQL (Database)"]

  A -->|"HTTP API / CORS"| B
  B --> C
  C --> D
  D --> E
```

---

## 🚀 Key Features

### 🔐 Authentication & RBAC
* Secure login, registration, and password hashing using bcrypt.
* **Refresh Token Rotation (RTR)** to prevent session replay attacks.
* Multi-device session tracking and audit logging.
* Custom middleware guards enforcing student, club president, faculty coordinator, college admin, and superadmin scopes.

### 🏢 Club & Membership Management
* Discover approved clubs, join groups, and manage officer rosters.
* Dashboard for Presidents to approve/reject membership applications.
* Central gallery updates for club activities.

### 📅 Event & Verifiable Attendance
* Event proposal workflows requiring coordinator approvals.
* Attendance tracking via QR scanners and manual verification.
* Automated feedback collection and ratings.

### 📢 Campus Connect Feed
* Public feeds for college announcements and club posts.
* Likes, comments, and bookmarking.

### 🪙 Activity Points & Leaderboard
* Centralized points rules config for competitions, hackathons, and volunteering.
* Double-entry transactional points log mapping to student profiles.
* Live leaderboard filtering by department, academic year, and club.

### 🎓 Verifiable Certificates & Portfolios
* Generates verifiable cryptographic certificate IDs (e.g. `CERT-E12F3D`).
* Public verification gateway mapping recipient name, issue date, and issuer.
* PDF/JSON student portfolio resumes displaying clubs joined, events attended, and total AP.

---

## 🌟 Unique Features

* **Campus Connect Feed**: A college-wide social workspace bridging students, faculty, and administrators.
* **Activity Points (AP) System**: Transactional ledger ensuring every point awarded has a verified event reference.
* **Student Portfolio**: Interactive resume aggregating verified activity, certificates, and volunteer records.
* **Supabase Session Pooler Bypass**: Handles IPv6/firewall restrictions by routing database operations over Session Port `5432` safely.

---

## 👥 User Roles & Access

| Role | Responsibilities | Permissions |
|---|---|---|
| **Student** | Participate in campus life | Search clubs, join groups, register for events, publish feed posts, track portfolio |
| **Club President** | Administer individual clubs | Manage club details, approve memberships, submit event proposals, post announcements |
| **Faculty Coordinator** | Academic moderation | Monitor assigned clubs, review and approve event proposals, issue verifiable certificates |
| **College Admin** | Campus operations | Approve new club registrations, manage opportunities, view engagement dashboards |
| **Super Admin** | Platform maintenance | Complete platform control, access audit logs, update global variables, manage user statuses |

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
* **Backend**: Node.js, Express.js, TypeScript, Winston Logger, Zod Validations, Helmet, CORS
* **Database & ORM**: Supabase PostgreSQL, Prisma ORM
* **Security & Tokens**: JWT, Cookie-based Refresh Tokens (RTR), bcryptjs

---

## 📂 Folder Structure

```
├── Backend/
│   ├── prisma/
│   │   ├── migrations/         # Database migrations
│   │   ├── schema.prisma       # Database relations mapping
│   │   └── seed.ts             # Default mock accounts seed
│   ├── src/
│   │   ├── config/             # DB connection, environment variables, logger, points rules
│   │   ├── controllers/        # Express request/response controllers
│   │   ├── middleware/         # Auth, RBAC guards, validation, and error handlers
│   │   ├── repositories/       # Prisma query repository layer
│   │   ├── routes/             # Express routes indexing
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # Hash, JWT generators, custom error definitions
│   │   └── server.ts           # App entryway
│   └── package.json
└── Frontend/
    ├── public/
    ├── src/
    │   ├── app/                # Main router entry
    │   ├── assets/             # Static vectors
    │   └── modules/            # React modules (analytics, auth, campus-connect, etc.)
    └── package.json
```

---

## 📊 Database Schema

```mermaid
erDiagram
  User ||--o{ RefreshToken : issues
  User ||--o{ Membership : joins
  User ||--o{ EventRegistration : registers
  User ||--o{ Post : publishes
  User ||--o{ AuditLog : triggers
  Club ||--o{ Membership : contains
  Club ||--o{ Event : organizes
  Event ||--o{ EventRegistration : holds
```

* **Major Entities**: `User`, `Club`, `Membership`, `Event`, `EventRegistration`, `Attendance`, `Post`, `Comment`, `PostLike`, `Bookmark`, `Opportunity`, `OpportunityApplication`, `Notification`, `Certificate`, `Project`, `Achievement`, `AuditLog`, `GlobalSetting`.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/login` | Authenticate user and issue tokens | No |
| **GET** | `/api/v1/auth/me` | Retrieve current authenticated user profile | Yes (Bearer) |
| **POST** | `/api/v1/auth/refresh` | Rotate and issue fresh access tokens | No (Cookie) |
| **GET** | `/api/v1/clubs` | Discover approved campus clubs | Yes |
| **POST** | `/api/v1/clubs` | Request creation of a new club | Yes (President/Admin) |
| **GET** | `/api/v1/events` | List all scheduled college events | Yes |
| **POST** | `/api/v1/events` | Submit event request proposal | Yes (President/Admin) |
| **POST** | `/api/v1/events/:eventId/register` | Register user for an approved event | Yes |
| **GET** | `/api/v1/posts` | Retrieve post feeds for logged-in user | Yes |
| **GET** | `/api/v1/leaderboard` | Get ranked students and AP levels | Yes |
| **POST** | `/api/v1/certificates/issue` | Issue a verifiable student certificate | Yes (Faculty/Admin) |
| **GET** | `/api/v1/certificates/verify/:id` | Publicly verify certificate authenticity | No |

---

## 🛠️ Installation & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SHRI-KRISHNA-S/demo1.git
cd demo1

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
NODE_ENV=development

# Database connections
DATABASE_URL="postgresql://postgres.btoytmstzxjdzhepdwrw:W7iC36t6OF7tGAtf@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.btoytmstzxjdzhepdwrw:W7iC36t6OF7tGAtf@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# JWT Config secrets
JWT_ACCESS_SECRET="super_secret_jwt_access_token_encryption_key_32_chars"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_SECRET="super_secret_jwt_refresh_token_encryption_key_32_chars"
JWT_REFRESH_EXPIRATION="7d"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Sync Database & Seed Mock Data
```bash
cd Backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run the Projects
```bash
# Start backend server
cd Backend
npm run dev

# Start frontend application (in a new terminal)
cd Frontend
npm run dev
```

---

## 👤 Test Accounts

For testing different permission scopes in the system, use these credentials (all use password: `password123`):

| Role | Test Email |
|---|---|
| **Student** | `student@college.edu` |
| **Club President** | `president@college.edu` |
| **Faculty Coordinator** | `faculty@college.edu` |
| **College Admin** | `admin@college.edu` |
| **Super Admin** | `superadmin@college.edu` |

---

## 📸 Screenshots

| Feature | Preview Placeholder |
| :--- | :--- |
| **Login Gateway** | `[ 🔒 Login Form - Dark Themed Glassmorphism ]` |
| **Student Dashboard** | `[ 📊 Upcoming Activities, Personal Timeline, & Verified AP Gauge ]` |
| **President Dashboard** | `[ 📝 Club Members list & Membership Approval Checklist ]` |
| **Faculty Dashboard** | `[ 🎓 Club Event Review Boards & Certificate Issuance Dashboard ]` |
| **Admin Dashboard** | `[ 📈 Campus Growth charts, Club Audits & Pending Proposals ]` |
| **Campus Connect Feed** | `[ 💬 Interactive College Feed with Pin boards & Announcements ]` |
| **Leaderboard** | `[ 🏆 Overall & Club Rankings displaying Level badges ]` |
| **Opportunity Hub** | `[ 💼 Hackathons, Internships, & Opportunity Cards ]` |

---

## 🛡️ Security Best Practices

* **HTTP-Only Cookies**: Refresh tokens are stored in secure, httpOnly cookies to prevent XSS-based theft.
* **Role Guards**: Strong TypeScript type-checks block unauthorized API calls early in the request pipeline.
* **Audit Logs**: Access events and metadata updates trigger database logs detailing origin IP address.
* **Database Safety**: Schema modifications are isolated inside transactional blocks to prevent database drift.

---

## 🤝 Contributors

| Member | Primary Responsibility |
|---------|------------------------|
| **SAKTHI M** |Team Lead • Frontend Development • UI/UX • Dashboard Implementation |
| **SHRI KRISHNA S** | Backend Architecture • Database Design • System Integration |
| **SANTHOSH K M** | Backend Development • REST APIs • Authentication & Security |
| **MOUNIKA SRI M** | Frontend Development • Testing • Documentation • UI Integration |

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
