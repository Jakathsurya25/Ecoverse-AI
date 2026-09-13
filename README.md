# 🌍 EcoVerse AI
> **The World's First Autonomous Sustainability Operating System**

EcoVerse AI is a premium, production-ready SaaS platform engineered to bridge the gap in sustainable living. Traditional eco trackers rely on manual inputs and static habit checklists, leading to quick user fatigue. EcoVerse AI automates sustainability through autonomous document ingestion (OCR), AI-driven lifestyle classification, long-term impact simulations, and a gamified social ecosystem.

---

## 📋 Overview

### The Problem
People genuinely want to live sustainably, but they face major friction points:
1. They do not know their exact resource consumption (electricity, water, shopping waste).
2. Carbon calculations are manual and feel like chores.
3. Users lose motivation quickly due to a lack of visual progression and community dynamics.

### The Solution
EcoVerse AI acts as an **Operating System for your carbon footprint**. By uploading grocery receipts, utility invoices, and commuting logs, the system automatically classifies items, calculates carbon weight, projects impact over a 10-year span, and feeds progress into a **Digital Twin Earth**. Users earn redeemable **EcoCoins** to fund real-world reforestation, while competing in department-wide leaderboards.

---

## 🚀 Features

### 1. Authentication
* **Multi-provider Login**: Support for JWT-based credentials, Google OAuth, GitHub OAuth, and Email OTP (One-Time Passcode) verification.
* **Session Management**: Session token persistence and logging of client IP addresses and user agents for audit compliance.

### 2. OS Console Dashboard
* **Live EcoScore**: A real-time dynamic score (1–1000) indicating current sustainability health.
* **Consumption Profiles**: Dynamic resource profiling charts displaying weekly water, carbon, and energy trends using Recharts.
* **Eco Timeline**: A unified, scrolling event ledger logging every processed invoice, transport commute, and challenge completion.

### 3. AI Sustainability Engine
* **Coaching Directives**: Customized recommendations dynamically compiled based on utility bill spikes and shopping plastic indexes.
* **Natural Dialogue Coach**: Context-aware AI chat consultant answering energy mitigation queries.
* **Daily Eco Missions**: Dynamic challenge generation tailored to user levels and category defaults.

### 4. OCR Ingestion & Receipt Intelligence
* **Autonomous Parsing**: Ingestion of PDF, JPG, and PNG electricity, water, and grocery documents.
* **Product Classification**: Automatic product extraction mapping item categories to low/high carbon scores.
* **Plastic Risk Detection**: Identification of packaging hazards (e.g. single-use containers) to suggest green alternatives.

### 5. Future Simulator
* **Time-Machine Modelling**: Forward projections for 1-year, 5-year, and 10-year spans.
* **Life Path Comparisons**: Computes environmental degradation parameters (CO₂ footprint, water waste, trees lost, money wasted) across *Hyper-Eco*, *Current*, and *Unsustainable* profiles.

### 6. Carbon Wallet & Rewards
* **EcoCoin Ledger**: Earn coins via verified scanning activities and spend them on ecological rewards.
* **Marketplace Catalog**: Sponsors real mangrove tree plantings (WWF partnerships), NGO contributions, and zero-plastic merchandise.

### 7. Community Forest & Social
* **Department Rankings**: Aggregated Campus Sustainability Index rankings comparing academic departments.
* **Campus Canopy**: A visual forest grid representing real trees sponsored collectively by college members.

### 8. Eco Resume
* **Certified Achievements**: Visual badges (Zero Emissions, Grid Guardian, Hydration Guardian) for verified accomplishments.
* **PDF Export**: Print-ready, structured layouts with SHA-256 validation hashes for career applications.

### 9. Admin Panel & Audits
* **Analytics Console**: Live tracking of token usage, database uptime, active profiles, and OCR load.
* **Challenge Management**: CRUD controls for system-wide daily missions.
* **Security Audit Trail**: Log records tracking admin actions and user modifications.

---

## 🛠️ Technology Stack
* **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts, Axios
* **Backend**: FastAPI, SQLAlchemy, Pydantic, Passlib, PyJWT
* **Database**: MySQL 8 (fully normalized with foreign keys and UUIDs)
* **Orchestration**: Docker Compose & Nginx Reverse Proxy

---

### 🏗️ Folder Structure
```text
ecoverse-ai-fullstack/
├── backend/                      # Python FastAPI application
│   ├── app/
│   │   ├── core/                 # Configs and Security JWT tokens
│   │   ├── database/             # SQLAlchemy sessions
│   │   ├── models/               # SQLAlchemy models
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── routers/              # Auth & API router paths
│   │   ├── services/             # AI simulation & OCR parser
│   │   └── main.py               # FastAPI gateway entry point
│   └── requirements.txt          # Python package lists
├── frontend/                     # React 19 / Next.js 15 app
│   ├── src/app/                  # Dashboard and Landing pages
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
├── database/
│   ├── schema.sql                # Normalised MySQL 8 schema script
│   └── seed.sql                  # Seeding logs with demo credentials
├── docker/
│   ├── docker-compose.yml        # Multi-container conductor
│   ├── Dockerfile.backend        # FastAPI Dockerfile
│   ├── Dockerfile.frontend       # NextJS Dockerfile
│   └── nginx.conf                # Reverse proxy mapping ports
├── demo/
│   └── index.html                # Standalone fully-interactive HTML interface
├── .env.example                  # Environmental configurations template
└── README.md                     # Documentation logs
## 🗄️ Database Design

The relational database modeled in `prisma/schema.prisma` comprises 31 tables linked through strict foreign keys, constraints, and index optimizations:

1. **User**: Authentication credentials, roles (`USER`, `ADMIN`, `SUPERUSER`), and relation maps.
2. **Profile**: Extended biographical details, campus labels, and department titles. Indexed on `[campus, department]`.
3. **EcoScore**: Trackers for cumulative saved carbon, water, energy, level tiers, and rank indexes.
4. **DailyActivity**: Commits of transport, water, recycling, and shopping actions. Indexed on `[userId, type]` and `[createdAt]`.
5. **Challenge**: Standard and AI-generated sustainable task configurations.
6. **CompletedChallenge**: Relational mapping between users and challenges. Indexed on `[userId, challengeId]`.
7. **CarbonHistory**: Compiles timeline carbon summaries. Indexed on `[userId, date]`.
8. **ElectricityBill**: Bill metadata, energy metrics (kWh), cost, and JSON extracted logs.
9. **WaterUsage**: Water consumption statements, cubic metrics (liters), and status tracking.
10. **ReceiptScan**: Parsed merchants, purchase items (JSON), carbon weight, and file URLs.
11. **TransportLog**: Travel summaries mapping mileage, mode (`CAR`, `BIKE`, `FLIGHT`, etc.), and commute tags.
12. **FoodLog**: Meal profiles logging ingredients, carbon categories (`LOW`, `HIGH`), and organic classifications.
13. **Achievement**: Global achievements containing coin incentives and badge resources.
14. **RewardPoints**: Current coin balances, spend logs, and transaction structures.
15. **Leaderboard**: Standardized standings logs categorized by period (`WEEKLY`, `ALL_TIME`). Indexed on `[period, scoreType, score(desc)]`.
16. **Team**: Campus teams. Creator link back to `User`.
17. **Community**: Aggregated university statistics showing total trees, indices, and member loads.
18. **EcoMarketplace**: Catalog parameters for offsets, trees, and sustainable goods.
19. **Purchase**: Purchase histories linking users to marketplaces. Indexed on `[userId]`.
20. **VirtualForest**: Virtual estate details computing real-time carbon offsets.
21. **TreeGrowthHistory**: Growth indicators for virtual trees (`SEED` to `MATURE`). Indexed on `[forestId]`.
22. **Badge**: Certified achievements awarded to user profiles.
23. **Notification**: Inbox alerts categorized by type (`BILL_SCAN`, `CHALLENGE`). Indexed on `[userId, isRead]`.
24. **AIRecommendation**: Active recommendations reflecting difficulty and target indices. Indexed on `[userId]`.
25. **ChatHistory**: Chat threads linking user requests and AI coach statements. Indexed on `[userId]`.
26. **Report**: Periodic summaries (`WEEKLY`, `MONTHLY`) grouping carbon, energy, and transport parameters.
27. **Settings**: Notifications toggles, profile visibility, and transportation defaults.
28. **Feedback**: Ratings, reports, and administrative responses.
29. **Session**: User sessions mapping IP addresses, tokens, and agents.
30. **Admin**: Privileged authorization profiles mapping permission levels.
31. **AuditLog**: Admin trails capturing administrative queries. Indexed on `[userId]` and `[createdAt]`.

---

## 🔌 API Documentation

### 1. Process Uploaded Invoice
* **Route**: `POST /api/ocr/scan`
* **Description**: Receives a file attachment (receipt, electricity bill, water bill), parses text content, estimates emissions, and awards EcoCoins.
* **Request (Form Data)**:
  ```json
  {
    "file": "fileBinaryData",
    "fileName": "electricity_bill_july.pdf"
  }
  ```
* **Response (JSON)**:
  ```json
  {
    "success": true,
    "type": "ELECTRICITY",
    "merchant": "City Power Grid Ltd",
    "totalAmount": 145.50,
    "extractedMetrics": {
      "kwh": 420,
      "co2Emitted": 168.0
    },
    "recommendations": [
      "Unplug idle electronics. Standby power accounts for 5-10% of utility bills."
    ]
  }
  ```

### 2. Fetch AI Recommendations
* **Route**: `GET /api/ai/recommendations`
* **Description**: Returns personalized carbon-saving instructions based on user behavior logs.
* **Response (JSON)**:
  ```json
  [
    {
      "id": "rec-1",
      "category": "ENERGY",
      "title": "Switch to Smart Thermostat",
      "description": "Optimize heating settings automatically. Save up to 10% on energy bills.",
      "potentialSavingsCo2": 320,
      "estimatedSavingsCost": 180,
      "difficulty": "Easy"
    }
  ]
  ```

### 3. Sustainability Coach Chat
* **Route**: `POST /api/ai/chat`
* **Description**: Consults the AI Sustainability Coach with a prompt.
* **Request (JSON)**:
  ```json
  {
    "message": "Why did my electricity bill spike?"
  }
  ```
* **Response (JSON)**:
  ```json
  {
    "reply": "Your electricity profile shows peak consumption spikes. Running laundry or high-drain dishes after 8 PM shifts you to low carbon grid density, reducing emissions by 15%."
  }
  ```

---

## 💻 Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **PostgreSQL**: Local or hosted database instance

### Setup Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ecoverse-ai.git
   cd ecoverse-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (see **Environment Variables** below).

4. **Initialize Prisma Database Schema**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to access the application.

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ⚙️ Environment Variables

Create a `.env` file containing the following variables:

```env
# Relational Database Connection (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/ecoverse?schema=public"

# Next Auth configurations
NEXTAUTH_SECRET="your-nextauth-secret-string-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Storage Service (Supabase)
SUPABASE_URL="https://yourproject.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-key"

# AI Sustainability Engine (OpenAI)
OPENAI_API_KEY="sk-proj-your-openai-api-key"
```

---

## 🔄 AI & OCR Processing Workflow

```mermaid
sequenceDiagram
    autonumber
    User->>Scan Console: Upload Receipt/Utility Bill
    Scan Console->>OCR Service: Extract raw invoice text
    OCR Service->>AI Engine: Parse line items & usage values
    AI Engine->>Database: Log CarbonHistory, ElectricityBill, or WaterUsage
    AI Engine->>EcoScore: Re-calculate score index & save attributes
    AI Engine->>Carbon Wallet: Disburse EcoCoins & log transaction
    AI Engine->>Scan Console: Present item replacements & offset logs
    EcoScore->>Digital Twin: Update virtual ocean index & canopy growth
```

---

## 🔒 Security & Performance Features

* **Privileged Audit Logging**: All database adjustments, challenge completions, and admin updates generate cryptographic audit entries.
* **OAuth & Session Integrity**: NextAuth handles secure session verification, credentials encryption, and brute force mitigations.
* **Optimized Rendering**: Recharts rendering leverages canvas acceleration, while dashboard transitions are hardware-accelerated via GSAP.
* **Scoped Relational Indexes**: Relational lookups on high-frequency tables (such as `Leaderboard`, `CompletedChallenge`, and `AuditLog`) are indexed to maintain sub-second response times under heavy concurrent loads.
