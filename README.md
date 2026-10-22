# GasTrack — Intelligent LPG Cylinder & Supply Chain Management System

[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![ODM: Mongoose](https://img.shields.io/badge/ODM-Mongoose%20v9-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Backend: Node.js & Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20TypeScript-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20TypeScript-61DAFB?logo=react&logoColor=black)](https://vitejs.dev/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Executive Overview

**GasTrack** is an enterprise-grade full-stack supply chain and asset tracking system engineered exclusively for Liquefied Petroleum Gas (LPG) distributors, bottling plants, and commercial fleets. The platform manages the entire lifecycle of gas cylinders—from initial inventory intake and customer delivery dispatch to high-pressure bottling plant refilling, statutory hydrostatic leak testing, valve overhaul ticketing, and multi-channel revenue reconciliation.

Built using **MongoDB Atlas + Mongoose ODM** on the backend and **React 18 + TypeScript + Vite + Tailwind CSS** on the frontend.

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom dark mode & glassmorphic panels
- **State & Server Queries**: TanStack Query (`@tanstack/react-query`)
- **Navigation & Routing**: React Router v7 (`react-router-dom`)
- **Analytics & Telemetry**: Recharts (Donut, Multi-Bar, Area, and Radial gauges)
- **Icons**: Lucide React
- **Validation**: Zod schema parsing

### Backend
- **Runtime**: Node.js v20+ with Express.js & TypeScript
- **Database & ODM**: MongoDB & Mongoose v9
- **Authentication**: Stateless JSON Web Tokens (JWT) with bcrypt salt hashing
- **Validation**: Zod input validation schemas
- **Architecture**: Modular Controller-Service-Repository pattern with complete lifecycle state machine

---

## 🗄️ Database Architecture (14 Mongoose Models)

GasTrack utilizes a dedicated MongoDB database named **`gastrack`** containing 14 models with indexes, references, timestamps, and validation:

| # | Model / Collection | Description | Key Indexes |
|---|---|---|---|
| 1 | **`users`** | Authentication, roles (`ADMIN`, `MANAGER`, `DELIVERY_STAFF`, `INVENTORY_STAFF`, `MAINTENANCE_STAFF`) | `email` (unique), `role` |
| 2 | **`customers`** | Client directory (`HOUSEHOLD`, `COMMERCIAL`, `INDUSTRIAL`), cylinder custody counts, receivables | `customerId` (unique), `phone`, `email` |
| 3 | **`cylinders`** | Individual cylinder asset records (types, tare/gross capacity, brand, manufacturing/purchase dates, condition) | `serialNumber` (unique), `status`, `condition`, `currentLocation`, `currentCustomer` |
| 4 | **`cylinderStatusHistories`** | Immutable lifecycle audit trail recording every state change, operator, timestamp, and notes | `cylinder`, `timestamp`, `{ cylinder: 1, timestamp: -1 }` |
| 5 | **`inventoryMovements`** | Physical custody & logistics transfers (`RECEIVED`, `ISSUED`, `DELIVERED`, `RETURNED`, `SENT_FOR_REFILL`, `REFILL_RETURN`, `SENT_FOR_MAINTENANCE`, `DAMAGED`, `RETIRED`) | `cylinder`, `movementType`, `createdAt` |
| 6 | **`locations`** | Central warehouses, regional depots, delivery vehicles, bottling plants, and maintenance centers | `name` (unique), `type` |
| 7 | **`deliveries`** | Client dispatch orders, delivery schedule, assigned cylinder, staff routing, and fulfillment status | `deliveryStatus`, `customer`, `deliveryStaff`, `scheduledDate` |
| 8 | **`payments`** | Secure revenue records (`CASH`, `UPI`, `CARD`, `BANK_TRANSFER`, `OTHER`) with zero sensitive card storage | `paymentId` (unique), `customer`, `paymentDate` |
| 9 | **`refillPlants`** | Certified bottling terminals with capacity metrics and contact profiles | `code` (unique), `name` |
| 10 | **`refillBatches`** | Batched cylinder lots sent to plants for high-pressure refilling | `batchId` (unique), `status`, `refillPlant` |
| 11 | **`inspections`** | Hydrostatic pressure tests, immersion leak tests, valve and body assessments | `inspectionId` (unique), `cylinder`, `result`, `inspectionDate`, `nextInspectionDate` |
| 12 | **`maintenances`** | Workshop work orders (`VALVE_REPLACEMENT`, `HYDROSTATIC_TEST`, `RE_PAINTING`, `COLLAR_REPAIR`, etc.) | `maintenanceId` (unique), `cylinder`, `status`, `startDate` |
| 13 | **`notifications`** | Automated alerts (`LOW_INVENTORY`, `DELIVERY_DELAY`, `INSPECTION_DUE`, `PAYMENT_DUE`) | `user`, `isRead`, `createdAt` |
| 14 | **`auditLogs`** | System-wide security audit trail capturing user ID, IP address, target entity, and operations | `action`, `entity`, `entityId`, `createdAt` |

---

## 🔄 Cylinder Lifecycle State Machine

GasTrack strictly enforces the full physical and regulatory lifecycle:

```text
RECEIVED (Intake & Commissioning)
    ↓
AVAILABLE / FILLED (In Central Warehouse)
    ↓
ASSIGNED (Allocated to Delivery Route)
    ↓
DELIVERED (At Customer Premises)
    ↓
RETURNED / EMPTY (Collected During Delivery Exchange)
    ↓
IN_REFILL (Dispatched in Batch to Bottling Plant)
    ↓
REFILLED & QUALITY CHECK
    ↓
INSPECTION (Mandatory Post-Refill Immersion & Pressure Test)
    ↓
   ├── [PASSED] ──────────→ AVAILABLE (Re-enters circulation)
   ├── [NEEDS_MAINTENANCE] → MAINTENANCE (Workshop Valve/Collar Repair) → INSPECTION
   ├── [FAILED] ──────────→ DAMAGED (Isolated from fleet)
   └── [REJECTED] ────────→ RETIRED (Permanent decommissioning)
```

### Business Logic Guardrails Enforced in Backend
1. **Duplicate Prevention**: Duplicate serial numbers are rejected at the database and application levels.
2. **LOST Protection**: Cylinders marked `LOST` cannot be assigned or delivered until recovered and inspected.
3. **RETIRED Lockdown**: Cylinders marked `RETIRED` can never be reactivated or recirculated.
4. **Defect Isolation**: Cylinders marked `DAMAGED`, `CRITICAL`, or `REJECTED` cannot be delivered.
5. **Maintenance Exclusivity**: Cylinders in `MAINTENANCE` cannot be allocated to deliveries.
6. **Inspection Enforcement**: A failed safety inspection can never return a cylinder to `AVAILABLE`.
7. **Atomic Auditing**: Every status change writes both a `cylinderStatusHistories` record and an `inventoryMovements` entry.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **MongoDB**: MongoDB Atlas connection string (or local MongoDB on port 27017)
  *(Note: An embedded fallback engine automatically provisions if no external URI is reachable)*

### 2. Installation

Clone or open the repository:

```bash
cd /Users/arunkumar/.gemini/antigravity-ide/scratch/gastrack

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Environment Configuration

Create or modify `backend/.env`:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gastrack?retryWrites=true&w=majority
JWT_SECRET=gastrack_ultra_secure_jwt_token_secret_key_2026_xyz!
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed the Database

Run the Mongoose seeder to populate all 14 collections with comprehensive demo data:

```bash
cd backend
npm run seed
```

This generates:
- 13 Users (Admin, 2 Managers, 5 Delivery Drivers, 3 Inventory Staff, 2 Maintenance Techs)
- 35+ Customers across Household, Commercial, and Industrial sectors
- 105 Cylinders with complete lifecycle state distributions
- 30 Deliveries with fulfillment logs
- 3 Bottling Refill Batches
- 25 Safety Leak & Hydrostatic Inspections
- 10 Maintenance Work Orders
- 25 Revenue Payment Receipts
- 8 System Notifications
- 40+ Immutable Audit Logs

### 5. Start Development Servers

Run backend and frontend servers:

```bash
# Terminal 1: Backend API (port 5001)
cd backend
npm run dev

# Terminal 2: Frontend Client (port 5173)
cd frontend
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## ☁️ MongoDB Atlas Configuration Guide

To connect GasTrack directly to a cloud MongoDB Atlas cluster:

### Step 1: Create a MongoDB Atlas Cluster
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared M0 cluster (e.g., `Cluster0`).
3. Select your cloud provider and preferred AWS / GCP / Azure region.

### Step 2: Configure Database User Authentication
1. Navigate to **Security** → **Database Access**.
2. Click **Add New Database User**.
3. Set **Authentication Method** to `Password`.
4. Choose a username (e.g., `gastrack_admin`) and secure password.
5. Under **Database User Privileges**, select **Read and write to any database**.
6. Click **Add User**.

### Step 3: Configure Network Access
1. Navigate to **Security** → **Network Access**.
2. Click **Add IP Address**.
3. For local development, choose **Allow Access From Anywhere** (`0.0.0.0/0`) or enter your current public IP address.
4. Click **Confirm**.

### Step 4: Obtain Connection String
1. In the **Databases** view, click **Connect** next to your cluster.
2. Select **Drivers** (Node.js).
3. Copy the SRV connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Append `/gastrack` to specify the database name:
   ```text
   mongodb+srv://gastrack_admin:<password>@cluster0.xxxxx.mongodb.net/gastrack?retryWrites=true&w=majority
   ```

### Step 5: Update `.env` & Run Seeder
Paste your connection URI into `backend/.env`:

```env
MONGODB_URI=mongodb+srv://gastrack_admin:<password>@cluster0.xxxxx.mongodb.net/gastrack?retryWrites=true&w=majority
```

Run the seed command:

```bash
npm run seed
```

---

## 🔑 Demo Login Credentials

You can sign in with any of the accounts below, or use the **1-Click Persona Switcher** on the login page and top navbar:

| Persona | Email | Password | Role | Permissions |
|---|---|---|---|---|
| **Alexander Pierce** | `admin@gastrack.com` | `Password123!` | `ADMIN` | Full system access, audit logs, financials, user admin |
| **Sarah Jenkins** | `manager1@gastrack.com` | `Password123!` | `MANAGER` | Fleet dispatch, batch oversight, client management |
| **Carlos Mendez** | `delivery1@gastrack.com` | `Password123!` | `DELIVERY_STAFF` | Route dispatch, customer exchange, payment collection |
| **Rajesh Patel** | `inventory1@gastrack.com` | `Password123!` | `INVENTORY_STAFF` | Cylinder registration, batch creation, intake |
| **Viktor Kowalski** | `maint1@gastrack.com` | `Password123!` | `MAINTENANCE_STAFF` | Leak inspections, valve overhauls, test certifications |

---

## 🛠️ Build & Production Deployment

### Compile TypeScript Backend
```bash
cd backend
npm run build
npm start
```

### Compile React Production Bundle
```bash
cd frontend
npm run build
```

The optimized static files are placed in `frontend/dist/`.

---

## 📡 REST API Reference

| Endpoint | Method | Role Required | Description |
|---|---|---|---|
| `/api/auth/login` | `POST` | Public | Authenticates user and returns JWT token |
| `/api/auth/me` | `GET` | Authenticated | Retrieves current authenticated session |
| `/api/cylinders` | `GET` | Authenticated | Paginated fleet query with status/condition filters |
| `/api/cylinders/:id` | `GET` | Authenticated | Detailed cylinder specifications |
| `/api/cylinders/:id/history` | `GET` | Authenticated | Lifecycle status audit history |
| `/api/cylinders/:id/movements`| `GET` | Authenticated | Inventory physical movements log |
| `/api/cylinders/:id/status` | `POST` | Staff / Manager | Transitions cylinder lifecycle status |
| `/api/cylinders` | `POST` | Inventory / Admin | Registers new cylinder asset |
| `/api/customers` | `GET` | Authenticated | Customer client directory |
| `/api/deliveries` | `GET` | Authenticated | Delivery dispatch orders |
| `/api/deliveries` | `POST` | Staff / Manager | Schedules delivery & allocates cylinder |
| `/api/deliveries/:id/status` | `PUT` | Delivery / Manager | Dispatches or completes delivery |
| `/api/refill/plants` | `GET` | Authenticated | Bottling terminals directory |
| `/api/refill/batches` | `GET` | Authenticated | Refill batches pipeline |
| `/api/refill/batches` | `POST` | Inventory / Manager| Dispatches batch of empty cylinders |
| `/api/refill/batches/:id/status`| `PUT`| Inventory / Manager| Advances batch through filling stages |
| `/api/inspections` | `GET` | Authenticated | Safety leak & pressure test records |
| `/api/inspections` | `POST` | Maintenance Staff | Logs inspection and updates cylinder state |
| `/api/maintenance` | `GET` | Authenticated | Workshop repair work orders |
| `/api/maintenance` | `POST` | Maintenance Staff | Issues cylinder overhaul work order |
| `/api/payments` | `GET` | Authenticated | Multi-channel revenue receipts |
| `/api/payments` | `POST` | Cashier / Delivery | Records payment & balances customer ledger |
| `/api/dashboard/summary` | `GET` | Authenticated | Aggregate telemetry, Recharts data, alerts |
| `/api/audit-logs` | `GET` | Admin / Manager | Cryptographic system audit trail |

---

Developed with ❤️ using MongoDB, Mongoose, Express, React, and Tailwind CSS.
