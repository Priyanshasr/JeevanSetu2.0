# JeevanSetu 2.0 — Healthcare Within Everyone's Reach

<div align="center">
  <img src="docs/banner.png" alt="JeevanSetu 2.0" width="800" />
  
  **AI-powered healthcare discovery and coordination platform for India**
  
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
  [![TinyFish](https://img.shields.io/badge/Powered%20by-TinyFish%20AI-blue)](https://tinyfish.ai)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 🏥 Overview

JeevanSetu 2.0 is a full-stack healthcare discovery and coordination platform that connects patients with hospitals, qualified doctors, registered medical practitioners (RMPs), paramedics, and emergency services across India — with a focus on rural and underserved areas.

The platform integrates **TinyFish AI** as its core web-intelligence engine to discover, extract, and continuously monitor healthcare provider information from across the web.

---

## ✨ Key Features

### 🔍 Smart Provider Discovery
- Search hospitals, doctors, PHCs, CHCs, ambulances, paramedics, and RMPs
- Filter by location, PIN code, specialization, hospital type, and services
- Map and list views with distance calculation
- Source URL tracking — every provider record links to its origin

### 🤖 TinyFish AI Healthcare Discovery Agent
- **TinyFish Search**: Discovers relevant healthcare websites in real-time
- **TinyFish Fetch**: Extracts clean structured data from provider websites
- **TinyFish Agent**: Multi-step automation for complex data extraction workflows
- **TinyFish Monitor**: Continuously monitors official healthcare websites for changes
- Live activity dashboard showing task progress and extraction results

### 📋 Medical Report Management
- Secure file upload (PDF, images) with private storage
- Patient-controlled consent management
- Doctor access permissions with audit trail
- Short-lived secure access to shared records
- Clinical observations and follow-up tracking

### 👨‍⚕️ Doctor–Patient Coordination
- Appointment requests and status tracking
- Doctor observations and prescriptions
- Follow-up recommendations
- Patient report sharing with explicit consent

### 🚨 Emergency Assistance
- One-tap emergency request
- Nearby emergency provider discovery via TinyFish
- Ambulance contact directory (108, 1102, state services)
- Location-sharing consent
- Real-time request status tracking

### 🏛️ Government Healthcare Schemes
- Ayushman Bharat / PMJAY
- CGHS (Central Government Health Scheme)
- ESIS (Employee State Insurance)
- State-specific schemes
- Eligibility checker and application links

---

## 🏗️ Architecture

```
JeevanSetu2.0/
├── frontend/                    # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Design system (Button, Card, Modal, etc.)
│   │   │   ├── layout/          # Navbar, Footer, DashboardLayout
│   │   │   ├── discovery/       # ProviderSearch, ProviderCard, TinyFishActivityPanel
│   │   │   ├── medical/         # RecordUpload, ConsentManager
│   │   │   ├── appointments/    # AppointmentForm, AppointmentCard
│   │   │   └── emergency/       # EmergencyPanel
│   │   ├── pages/
│   │   │   ├── public/          # Landing, About, HowItWorks, Services, Contact
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── patient/         # PatientDashboard
│   │   │   ├── doctor/          # DoctorDashboard
│   │   │   ├── hospital/        # HospitalDashboard
│   │   │   ├── paramedic/       # ParamedicDashboard
│   │   │   └── admin/           # AdminDashboard
│   │   ├── context/             # AuthContext
│   │   ├── config/              # API client (Axios)
│   │   └── utils/               # Helpers
│   └── package.json
│
├── backend/                     # FastAPI + Python
│   ├── app/
│   │   ├── api/routes/          # All API endpoints
│   │   │   ├── auth.py
│   │   │   ├── patients.py
│   │   │   ├── doctors.py
│   │   │   ├── hospitals.py
│   │   │   ├── providers.py
│   │   │   ├── tinyfish.py      # TinyFish integration routes
│   │   │   ├── medical_records.py
│   │   │   ├── appointments.py
│   │   │   ├── emergency.py
│   │   │   ├── admin.py
│   │   │   └── schemes.py
│   │   ├── models/              # SQLAlchemy models (17 tables)
│   │   ├── services/
│   │   │   └── tinyfish/        # TinyFish service layer
│   │   │       ├── client.py    # Authenticated HTTP client
│   │   │       ├── search.py    # Search API integration
│   │   │       ├── fetch.py     # Fetch API integration
│   │   │       ├── agent.py     # Agent automation
│   │   │       ├── monitor.py   # Website monitoring
│   │   │       ├── normalizer.py # Data normalization
│   │   │       └── validator.py  # Data validation
│   │   ├── core/
│   │   │   ├── config.py        # Pydantic settings
│   │   │   └── security.py      # JWT + bcrypt
│   │   └── db/
│   │       ├── database.py      # SQLAlchemy engine
│   │       └── seed.py          # Synthetic seed data
│   ├── uploads/                 # Private file storage (gitignored)
│   ├── requirements.txt
│   └── main.py
│
├── .env.example                 # Environment template
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS, React Router 7 |
| UI Components | Lucide React icons, react-leaflet (maps) |
| HTTP Client | Axios |
| Backend | FastAPI 0.115, Python 3.14 |
| ORM | SQLAlchemy 2.0 + Alembic |
| Database | SQLite (dev) → Supabase PostgreSQL (prod) |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| AI/Web | TinyFish Search, Fetch, Agent, Monitor APIs |
| Maps | OpenStreetMap via Leaflet |
| File Storage | Local filesystem (dev) → Supabase Storage (prod) |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- A TinyFish API key from [agent.tinyfish.ai/api-keys](https://agent.tinyfish.ai/api-keys)

### 1. Clone and configure
```bash
git clone https://github.com/Priyanshasr/JeevanSetu2.0.git
cd JeevanSetu2.0
cp .env.example .env
# Edit .env and add your TINYFISH_API_KEY and SECRET_KEY
```

### 2. Start the backend
```bash
cd backend
pip install -r requirements.txt
python app/db/seed.py        # Create tables + seed demo data
uvicorn main:app --reload    # Starts at http://localhost:8000
```

### 3. Start the frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # or create it with VITE_API_BASE_URL=http://localhost:8000
npm run dev                         # Starts at http://localhost:5173
```

### 4. Access the application
- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

---

## 🔑 Environment Variables

### Root `.env`
| Variable | Description | Required |
|----------|-------------|----------|
| `TINYFISH_API_KEY` | Your TinyFish API key | ✅ |
| `SECRET_KEY` | JWT signing secret (min 32 chars) | ✅ |
| `DATABASE_URL` | SQLAlchemy database URL | ✅ |
| `ENVIRONMENT` | `development` or `production` | ✅ |
| `SUPABASE_URL` | Supabase project URL (production) | Production |
| `SUPABASE_ANON_KEY` | Supabase anon key (production) | Production |

### Frontend `frontend/.env.local`
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_APP_NAME` | Application display name |

---

## 🗄️ Database Setup

The app uses SQLite for local development. Tables are auto-created on startup.

### Tables
| Table | Description |
|-------|-------------|
| `users` | All users with role-based access |
| `patients` | Patient profiles and medical info |
| `doctors` | Doctor profiles and credentials |
| `hospitals` | Hospital/clinic profiles |
| `paramedics` | Paramedic profiles |
| `providers` | Discovered healthcare providers (from TinyFish) |
| `medical_records` | Patient medical files |
| `patient_consents` | Doctor access permissions |
| `appointments` | Appointment requests and tracking |
| `doctor_observations` | Clinical notes and diagnoses |
| `emergency_requests` | Emergency assistance requests |
| `notifications` | User notifications |
| `tinyfish_tasks` | TinyFish API task history |
| `website_monitors` | Active website monitors |
| `monitoring_changes` | Detected website changes |
| `audit_logs` | Security and access audit trail |

### Migrate to Supabase (Production)
```bash
# Update DATABASE_URL in .env to your Supabase PostgreSQL connection string
# Then run Alembic migrations:
cd backend
alembic upgrade head
```

---

## 🤖 TinyFish Integration

### APIs Used
| API | Endpoint | Use Case |
|-----|----------|----------|
| Search | `GET https://api.search.tinyfish.ai` | Discover healthcare websites |
| Fetch | `POST https://api.fetch.tinyfish.ai` | Extract provider info from websites |
| Agent | `POST https://agent.tinyfish.ai/v1/automation/run` | Multi-step data extraction |
| Monitor | `POST https://agent.tinyfish.ai/v1/monitors` | Track provider website changes |

### Discovery Workflow
1. Patient submits search query (e.g., "government hospitals near Greater Noida")
2. Backend calls TinyFish Search to find relevant URLs
3. Backend calls TinyFish Fetch on discovered URLs to extract content
4. For complex sites, TinyFish Agent performs multi-step navigation
5. Normalizer converts raw content to structured `ProviderRecord` JSON
6. Validator deduplicates against existing DB records
7. New providers stored with `verification_status: pending`
8. Results returned to frontend with source URLs and timestamps

### Website Monitoring
```json
{
  "type": "fetch",
  "name": "NHM Delhi Provider Directory",
  "config": { "url": "https://nhm.delhi.gov.in", "format": "markdown" },
  "schedule_cron": "0 9 * * *",
  "purpose": "New hospitals or contact changes detected",
  "webhook_url": "http://your-backend.com/tinyfish/webhook"
}
```

---

## 📡 API Documentation

Interactive API docs: http://localhost:8000/docs (Swagger UI)

### Key Endpoints
```
POST /auth/register          Register new user
POST /auth/login             Login and get JWT token
GET  /auth/me                Get current user profile

GET  /providers/             Search healthcare providers
GET  /providers/{id}         Get provider details

POST /tinyfish/discover      Run AI discovery (Search + Fetch + normalize)
POST /tinyfish/agent         Run multi-step agent automation
GET  /tinyfish/tasks         List all TinyFish tasks
POST /tinyfish/monitors      Create website monitor
GET  /tinyfish/monitors      List active monitors
POST /tinyfish/webhook       Receive monitor change notifications

POST /medical-records/       Upload medical record
GET  /medical-records/       List patient records
POST /medical-records/{id}/share    Grant doctor access
DELETE /medical-records/{id}/share/{doctor_id}  Revoke access

POST /appointments/          Request appointment
GET  /appointments/          List appointments
PUT  /appointments/{id}/status      Update status

POST /emergency/request      Submit emergency request
GET  /emergency/nearby-providers    Find nearby emergency providers

GET  /schemes/               List government healthcare schemes
```

---

## 🧪 Demo Workflow

### Test Accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jeevansetu.in | Admin@1234 |
| Patient | ravi.kumar@example.com | Patient@1234 |
| Doctor | dr.priya@example.com | Doctor@1234 |
| Hospital | aiims.delhi@example.com | Hospital@1234 |

### AI Discovery Demo
1. Login as patient
2. Go to "Find Healthcare"
3. Enter: "Government hospitals in Greater Noida offering emergency services"
4. Watch TinyFish discover and extract real provider information
5. View results with source URLs

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

### Backend (Render)
1. Set environment variables in Render dashboard
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Database (Supabase)
1. Create project at supabase.com
2. Get connection string from Settings > Database
3. Update `DATABASE_URL` in environment variables
4. Run: `alembic upgrade head`

---

## 🔐 Security

- JWT authentication with configurable expiry
- bcrypt password hashing
- Role-based access control (RBAC)
- Patient consent required for all medical record access
- Private file storage (not publicly accessible)
- Audit logging for all sensitive operations
- Input validation on all endpoints
- CORS restricted to frontend origin
- API key stored only in backend environment
- No medical records sent to TinyFish APIs

---

## ⚠️ Limitations

- **TinyFish Monitoring**: Webhook requires a publicly accessible URL. In local dev, use ngrok or similar.
- **File Storage**: Uses local filesystem in dev. Migrate to Supabase Storage or S3 for production.
- **Maps**: Uses OpenStreetMap (free). No Google Maps API key required.
- **Provider Data**: Discovered data is marked `pending` and requires admin verification before being displayed as verified.
- **Not a medical device**: AI discovery summaries are informational only, not clinical advice.

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

<div align="center">
  Built with ❤️ for India's healthcare accessibility challenge<br/>
  Powered by <a href="https://tinyfish.ai">TinyFish AI</a> web intelligence
</div>
