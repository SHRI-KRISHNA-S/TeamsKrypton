# Database Schema with Sample Data

# College Club & Community Management Portal

---

# Database Overview

The application uses **PostgreSQL** as the primary relational database and **Prisma ORM** for database modeling and migration management.

The database is designed to support secure authentication, club management, event management, collaboration, student portfolios, Activity Points, certificates, and reporting.

---

# Database Architecture

```text
Users
 │
 ├────────────── Clubs
 │                   │
 │                   ├──────── Events
 │                   │              │
 │                   │              └──── Event Registrations
 │                   │
 │                   ├──────── Memberships
 │                   │
 │                   └──────── Posts
 │                                 │
 │                                 ├──── Comments
 │                                 ├──── Likes
 │                                 └──── Bookmarks
 │
 ├──────── Certificates
 │
 ├──────── Opportunities
 │
 ├──────── Notifications
 │
 ├──────── Activity Transactions
 │
 ├──────── Audit Logs
 │
 └──────── Refresh Tokens
```

---

# Entity Relationship Summary

| Parent | Child | Relationship |
|----------|---------|-------------|
| User | Club | One Faculty can coordinate many clubs |
| User | Membership | One User → Many Memberships |
| Club | Membership | One Club → Many Members |
| Club | Event | One Club → Many Events |
| Event | Registration | One Event → Many Registrations |
| User | Registration | One Student → Many Event Registrations |
| User | Certificate | One Student → Many Certificates |
| User | Post | One User → Many Posts |
| Post | Comment | One Post → Many Comments |
| Post | Like | One Post → Many Likes |
| User | Notification | One User → Many Notifications |

---

# Tables

---

## Users

| Column | Type |
|---------|------|
| id | UUID |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | ENUM |
| department | VARCHAR |
| year | INTEGER |
| avatar | TEXT |
| activityPoints | INTEGER |
| createdAt | TIMESTAMP |

### Sample Data

| Name | Email | Role |
|------|-------|------|
| Student | student@college.edu | STUDENT |
| President | president@college.edu | CLUB_PRESIDENT |
| Faculty | faculty@college.edu | FACULTY |
| Admin | admin@college.edu | ADMIN |
| Super Admin | superadmin@college.edu | SUPER_ADMIN |

---

## Clubs

| Column | Type |
|---------|------|
| id | UUID |
| name | VARCHAR |
| category | VARCHAR |
| description | TEXT |
| logo | TEXT |
| facultyId | UUID |
| presidentId | UUID |

### Sample Data

| Club |
|------|
| Coding Club |
| Robotics Club |
| Photography Club |

---

## Memberships

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| clubId | UUID |
| status | ENUM |
| joinedAt | TIMESTAMP |

### Sample Data

| Student | Club | Status |
|----------|------|--------|
| Student | Coding Club | APPROVED |

---

## Events

| Column | Type |
|---------|------|
| id | UUID |
| clubId | UUID |
| title | VARCHAR |
| description | TEXT |
| venue | VARCHAR |
| date | DATE |
| capacity | INTEGER |

### Sample Data

| Event | Club |
|--------|------|
| Hackathon 2026 | Coding Club |

---

## Event Registrations

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| eventId | UUID |
| attendance | BOOLEAN |

### Sample Data

| Student | Event |
|----------|-------|
| Student | Hackathon 2026 |

---

## Certificates

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| title | VARCHAR |
| category | VARCHAR |
| organization | VARCHAR |
| documentUrl | TEXT |
| status | ENUM |
| activityPoints | INTEGER |

### Sample Data

| Certificate | Status |
|--------------|--------|
| Hackathon Winner | APPROVED |

---

## Opportunities

| Column | Type |
|---------|------|
| id | UUID |
| title | VARCHAR |
| category | VARCHAR |
| organization | VARCHAR |
| deadline | DATE |

### Sample Data

| Opportunity |
|-------------|
| Smart India Hackathon |
| Google Summer of Code |

---

## Posts

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| clubId | UUID (nullable) |
| title | VARCHAR |
| content | TEXT |
| visibility | ENUM |

### Sample Data

| User | Title |
|------|-------|
| Student | Looking for Hackathon Team |

---

## Comments

| Column | Type |
|---------|------|
| id | UUID |
| postId | UUID |
| userId | UUID |
| comment | TEXT |

---

## Likes

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| postId | UUID |

---

## Bookmarks

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| postId | UUID |

---

## Notifications

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| title | VARCHAR |
| message | TEXT |
| isRead | BOOLEAN |

### Sample Data

| Title |
|--------|
| Membership Approved |
| Event Reminder |

---

## Activity Transactions

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| activity | VARCHAR |
| points | INTEGER |
| createdAt | TIMESTAMP |

### Sample Data

| Activity | Points |
|-----------|--------|
| Joined Club | 10 |
| Workshop | 50 |
| Hackathon Winner | 500 |

---

## Audit Logs

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| action | VARCHAR |
| createdAt | TIMESTAMP |

---

## Refresh Tokens

| Column | Type |
|---------|------|
| id | UUID |
| userId | UUID |
| token | TEXT |
| deviceId | VARCHAR |
| userAgent | TEXT |
| ipAddress | VARCHAR |
| expiresAt | TIMESTAMP |

---

# Database Statistics

| Table | Purpose |
|---------|----------|
| Users | User Information |
| Clubs | Club Details |
| Memberships | Club Members |
| Events | Event Information |
| Event Registrations | Event Participants |
| Certificates | Student Achievements |
| Opportunities | Career & Hackathon Opportunities |
| Posts | Campus Connect & Club Connect |
| Comments | Post Discussions |
| Likes | Social Engagement |
| Bookmarks | Saved Posts |
| Notifications | User Alerts |
| Activity Transactions | Activity Points History |
| Audit Logs | Security Tracking |
| Refresh Tokens | Session Management |

---

# Total Tables

| Category | Count |
|-----------|------:|
| Authentication | 3 |
| User Management | 2 |
| Club Management | 3 |
| Event Management | 2 |
| Collaboration | 4 |
| Portfolio | 2 |
| Reports & Logs | 2 |

**Total Database Tables:** **15+**

---

# Sample Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@college.edu | password123 |
| Club President | president@college.edu | password123 |
| Faculty Coordinator | faculty@college.edu | password123 |
| College Admin | admin@college.edu | password123 |
| Super Admin | superadmin@college.edu | password123 |

---

# Database Features

- PostgreSQL Relational Database
- Prisma ORM
- UUID Primary Keys
- Foreign Key Relationships
- JWT Session Storage
- Refresh Token Rotation
- Audit Logging
- Activity Points Tracking
- Certificate Verification
- Role-Based Access Control
- Cloud Ready (Supabase)
