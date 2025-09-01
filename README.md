# 🏗️ Construction Projects Platform — Backend (NestJS)

A **production-ready backend** for managing construction projects, built with **NestJS, TypeORM, and MySQL**. This platform supports multiple roles — **Clients, Companies, Engineers, and Admins** — and provides APIs for the project lifecycle, company offers, inspections, chat, payments, documents, notifications, and dashboards.

---

## 📑 Table of Contents

* [Project Overview](#-project-overview)
* [Main Features](#-main-features)
* [Tech Stack](#%EF%B8%8F-tech-stack)
* [Database Design](#%EF%B8%8F-database-design)
* [Environment Variables](#%EF%B8%8F-environment-variables)
* [API Documentation](#-api-documentation)
* [Local Development](#%EF%B8%8F-local-development)
* [Deployment](#-deployment)
* [Testing](#-testing)
* [Folder Structure](#-folder-structure)
* [Notes & Limitations](#%EF%B8%8F-notes--limitations)

---

## 📘 Project Overview

This backend powers a **multi-tenant construction management platform**:

* **Clients**: create/manage projects, receive company offers, schedule inspections, chat, attach documents, track payments and milestones.
* **Companies**: submit offers, manage milestones, receive payments, and track inspections.
* **Engineers**: assigned to inspections and manage tasks.
* **Admins**: oversee the platform, moderate content, adjust statuses, and access global stats.

🔑 **Key modules under `src/`:**

* `auth/`, `users/`, `companies/`, `projects/`, `offers/`, `milestones/`, `inspection-appointment/`, `chat/`, `project-documents/`, `payment/`, `notifications/`, `dashboards/`, `support-ticket/`, `static-content/`
* Entities: `src/entities/`
* Migrations: `database/migrations/`
* API collections: `API_Docs/` (Bruno/Postman format)

---

## 🚀 Main Features

### 🔐 Authentication & Authorization

* JWT-based auth with roles: `client`, `company`, `engineer`, `customer_service`, `admin`
* Role-guarded endpoints & ownership checks

### 📂 Project Lifecycle

* CRUD operations with pagination & ownership checks
* Statuses: `pending`, `in_progress`, `under_review`, `completed`, `paused`, `canceled`, `expired`, `republished`
* Linked milestones & services

### 💼 Company Offers

* Create/update/delete offers
* Statuses: `pending`, `accepted`, `rejected`
* Expiry checks for old projects

### 🛠️ Site Visit Scheduling (Inspections)

* Schedule inspections & assign engineers
* Notifications on changes
* Status management

### 💬 Chat System

* Project-specific chat (Client ↔ Company ↔ Engineer)
* Supports messages with attachments
* **Cloudinary integration** for media

### 💳 Payment System

* **Stripe Checkout integration**
* Payments linked to milestones
* Admin override capability
* Full audit trail

### 📎 Attachments & Documents

* Upload/download via API (Cloudinary storage)
* Metadata support
* Ownership restrictions on edit/delete

### 📊 Dashboards & Profiles

* Role-specific dashboards
* KPIs: project counts, revenue, upcoming inspections

### ⚙️ Settings & Notifications

* Push/In-app notifications
* User preferences management

### 🛠️ Admin Tools

* Full control over projects, users, payments
* Force status override
* Verification badge management

---

## 🛠️ Tech Stack

* **Backend Framework**: NestJS 11 (TypeScript 5)
* **ORM & Database**: TypeORM 0.3 + MySQL
* **Auth & Validation**: JWT, class-validator, class-transformer
* **Integrations**: Stripe, Cloudinary
* **Security**: Helmet, CORS, Rate Limiting
* **Testing**: Jest, Supertest

---

## 🗄️ Database Design

Core entities & relations:

* **User**: owns company, belongs to company as engineer, projects, messages, tickets, documents, notifications, inspections, paymentsMade
* **Company**: owner, engineers, offers, milestones, paymentsReceived
* **Project**: client, offers, milestones, inspections, chat, documents
* **Other Entities**: Offer, Milestone, Payment, InspectionAppointment, Chat/Message, ProjectDocument, Notification, SupportTicket, StaticContent

Migrations are located in `database/migrations/`

---

## ⚙️ Environment Variables

Create `.env` and `.env.test`:

```env
# Server
PORT=5030

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=secret
DB_DATABASE=construction_db

# Auth
ACCESS_TOKEN_SECRET_KEY=supersecret

# Stripe
STRIPE_SECRET_KEY=your_stripe_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📖 API Documentation

* API collections available in `API_Docs/` (Bruno format).
* Grouped by module for easy testing.

---

## 🖥️ Local Development

```bash
npm install
# Configure .env
npm run migration:run
npm run start:dev

# For production
npm run build
npm run start:prod
```

🔒 CORS enabled by default; adjust for production.

---

## 🚀 Deployment

```bash
npm run build
node dist/main.js
npm run migration:run
```

* Enable **Stripe webhook** in production
* Configure **CORS** for frontend origins

---

## 🧪 Testing

* **Unit tests**: `npm run test`
* **E2E tests**: `npm run test:e2e`

Testing DB uses `NODE_ENV=test` with in-memory schema.

---

## 📂 Folder Structure

```
src/           # Entities, modules, utils
database/      # Data source + migrations
API_Docs/      # API collections
test/          # E2E tests
```

---

## ⚠️ Notes & Limitations

* Payment flow stores inline after Stripe Checkout for dev/demo; production should use **webhooks**
* Global validation pipes & exception filters enabled
* Cloudinary supports arbitrary file types

---

❤️ With love, Mohamed Osama
