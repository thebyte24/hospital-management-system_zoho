# Hospital Queue & Wait-Time Management System

A comprehensive hospital workflow system built on **Zoho Catalyst** that tracks patients from check-in to consultation, prioritizes urgent cases, and provides wait-time analytics.

## 🎯 Project Overview

**Theme**: Reduce Patient Waiting Times

This system helps hospitals manage patient queues efficiently by:
- Allowing patients to check themselves in
- Automatically prioritizing urgent cases using a fair queue algorithm
- Providing real-time queue position and wait-time estimates
- Tracking comprehensive analytics for performance monitoring

## 🏗️ Architecture

### Tech Stack

- **Backend (AppSail)**: Node.js + Express with `zcatalyst-sdk-node`
- **Frontend (Slate)**: React + Vite with `react-router-dom`
- **Database (Data Store)**: Catalyst's managed relational database
- **Authentication**: Catalyst Embedded Authentication with custom roles

### Key Features

1. **Priority Queue Algorithm**: Urgent patients first, then FIFO within each priority level
2. **Role-Based Access Control**: Patient, Doctor, Admin/Reception roles
3. **Real-Time Analytics**: Average wait time, longest wait, completion rates
4. **Automatic Timestamps**: Check-in, consultation start, consultation end
5. **Clinical UI Design**: Muted colors, clear status indicators, optimized for scanning

## 📋 Prerequisites

- Zoho Catalyst account
- Node.js 14+ installed locally
- npm or yarn package manager

## 🗄️ Data Store Schema

### Important Notes
- **Tables must be created manually** in the Catalyst Console (Cloud Scale → Data Store)
- Every table auto-gets a `ROWID` primary key (do NOT create your own ID column)
- Use these exact table names and column names

### Table: Patients

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| Name | Text | Patient's full name |
| Age | Number | Patient's age in years |
| Gender | Text | Male, Female, or Other |
| Phone | Text | Contact phone number |
| BloodGroup | Text | Blood group (A+, B-, etc.) |
| UserID | Text | Links to Catalyst user ID (empty for walk-ins) |

### Table: Doctors

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| Name | Text | Doctor's full name |
| Specialization | Text | Medical specialization |
| Email | Email | Doctor's email address |
| Phone | Text | Contact phone number |
| UserID | Text | Links to Catalyst user ID |

### Table: Visits

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| PatientID | Text | ROWID reference to Patients table |
| DoctorID | Text | ROWID reference to Doctors table |
| VisitDate | Date | Date of visit |
| Reason | Text | Reason for visit / symptoms |
| Status | Text | "Waiting", "In Consultation", or "Completed" |
| Priority | Text | "Normal" or "Urgent" |
| CheckInTime | DateTime | When patient checked in |
| ConsultStartTime | DateTime | When consultation started |
| ConsultEndTime | DateTime | When consultation ended |
| Notes | Text | Doctor's consultation notes |

## 🚀 Deployment Instructions

### Step 1: Create Data Store Tables

1. Log into Catalyst Console
2. Navigate to **Cloud Scale → Data Store**
3. Click **"Create Table"**
4. Create all three tables with the exact schema above
5. Note: ROWID is created automatically

### Step 2: Install Dependencies Locally

**CRITICAL**: AppSail does not install dependencies on deploy. You must run `npm install` locally first.

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Deploy Backend (AppSail)

```bash
cd server

# Deploy to Catalyst
catalyst deploy

# Follow prompts:
# - Select project
# - Confirm AppSail deployment
```

**Note**: The server reads port from `process.env.X_ZOHO_CATALYST_LISTEN_PORT` (required by Catalyst).

### Step 4: Deploy Frontend (Slate)

```bash
cd client

# Build production bundle
npm run build

# Deploy to Catalyst
catalyst deploy

# Follow prompts:
# - Select project
# - Confirm Slate deployment
```

### Step 5: Configure Authentication

See **[CATALYST_AUTH_SETUP.md](./CATALYST_AUTH_SETUP.md)** for detailed authentication setup.

Quick steps:
1. Go to **Cloud Scale → Authentication → User Management → Roles**
2. Create three roles: **Patient** (default, allow signup), **Doctor**, **Admin**
3. Go to **Cloud Scale → Authentication → Whitelisting**
4. Add your Slate domain with CORS enabled

### Step 6: Enable Auth Middleware

After authentication is configured, uncomment these lines in `server/index.js`:

```javascript
const { requireAuth, requireRole } = require('./middleware/auth');

app.use('/patients', requireAuth, patientsRouter);
app.use('/doctors', requireAuth, doctorsRouter);
app.use('/visits', requireAuth, visitsRouter);
app.use('/analytics', requireRole('Admin', 'Doctor'), analyticsRouter);
```

### Step 7: Configure Frontend API URL

In production, update the API URL in `client/src/utils/api.js`:

```javascript
const API_BASE_URL = 'https://your-appsail-url.onslate.in';
```

Or set the environment variable:
```bash
VITE_API_URL=https://your-appsail-url.onslate.in
```

### Step 8: Create Sample Data

#### Create Doctors

1. Invite doctor users via Catalyst Console (Authentication → Users → Invite User)
2. Use Admin account or direct API to create Doctor records:

```bash
POST /doctors
{
  "Name": "Dr. Sarah Johnson",
  "Specialization": "General Medicine",
  "Email": "sarah@hospital.com",
  "Phone": "555-0101",
  "UserID": "catalyst_user_id_here"
}
```

#### Create Admin User

1. Invite admin user via Catalyst Console with Admin role
2. Admin can immediately access the system

#### Test with Patient

1. Go to signup page
2. Register as a patient (automatic Patient role)
3. Check in for an appointment

## 🎬 60-Second Demo Flow

This demonstrates all core features:

1. **Patient signup & check-in**
   - Patient signs up and checks themselves in for Dr. Johnson
   - Status: "Waiting", Priority: "Normal"

2. **Reception adds urgent case**
   - Admin checks in a walk-in patient
   - Sets Priority to "Urgent"
   - Urgent patient jumps to front of queue

3. **Doctor views queue**
   - Doctor sees urgent patient at position #1
   - Normal patient at position #2
   - Algorithm working correctly!

4. **Doctor processes patients**
   - Clicks "Start" on urgent patient → Status: "In Consultation"
   - Adds consultation notes
   - Clicks "Complete" → Status: "Completed", timestamps recorded

5. **Admin views analytics**
   - Average wait time updated
   - Completed count incremented
   - Real-time metrics displayed

## 🔐 User Roles & Permissions

### Patient
- **Access**: Own profile, own visits
- **Can**: Check in, view queue position, view visit history
- **Cannot**: See other patients, access analytics

### Doctor
- **Access**: Own queue, assigned visits
- **Can**: View queue, start consultations, complete visits, add notes
- **Cannot**: Check in patients, change priorities, view other doctors' queues

### Admin / Reception
- **Access**: All queues, all patients, analytics
- **Can**: Check in any patient (including walk-ins), set/change priority, view analytics
- **Cannot**: Perform consultations

## 🧮 Queue Algorithm

The core algorithm sorts waiting patients by:

1. **Priority** (Urgent before Normal)
2. **Check-in Time** (FIFO within same priority)

**Implementation**: `server/utils/queueAlgorithm.js`

```javascript
// Priority weight: Urgent = 0, Normal = 1
const sortedQueue = waitingVisits.sort((a, b) => {
  // Step 1: Compare by priority
  if (aPriority !== bPriority) {
    return aPriority - bPriority; // Urgent first
  }
  
  // Step 2: If same priority, compare by time (FIFO)
  return aTime - bTime; // Earlier check-in first
});
```

## 📊 Analytics Endpoints

### GET /analytics

Returns:
```json
{
  "averageWaitTimeToday": 23,      // minutes
  "currentlyWaiting": 5,            // count
  "longestCurrentWait": 45,         // minutes
  "completedToday": 12,             // count
  "waitingToday": 5,                // count
  "inConsultationToday": 2,         // count
  "totalVisitsToday": 19            // count
}
```

## 🎨 Design System

See **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** for complete design documentation.

**Quick Reference**:
- **Waiting**: Amber pill (#fef3c7 bg)
- **In Consultation**: Blue pill (#dbeafe bg)
- **Completed**: Green pill (#d1fae5 bg)
- **Urgent**: Red/Orange pill (#fee2e2 bg)

## 📁 Project Structure

```
hospital/
├── server/                    # Backend (AppSail)
│   ├── index.js              # Express server entry point
│   ├── package.json          # Dependencies (install before deploy!)
│   ├── routes/               # API endpoints
│   │   ├── patients.js       # CRUD for patients
│   │   ├── doctors.js        # CRUD for doctors
│   │   ├── visits.js         # CRUD for visits + queue endpoint
│   │   ├── analytics.js      # Wait-time analytics
│   │   └── auth.js           # Authentication endpoints
│   ├── middleware/
│   │   └── auth.js           # Auth & role-checking middleware
│   └── utils/
│       ├── catalyst.js       # Catalyst SDK helpers
│       └── queueAlgorithm.js # Priority queue sorting
│
├── client/                    # Frontend (Slate)
│   ├── index.html            # HTML entry point
│   ├── package.json          # Dependencies (install before deploy!)
│   ├── vite.config.js        # Vite configuration
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Router & auth wrapper
│       ├── pages/            # Page components
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── PatientDashboard.jsx
│       │   ├── DoctorDashboard.jsx
│       │   └── AdminDashboard.jsx
│       ├── components/       # Shared components
│       │   ├── Layout.jsx
│       │   └── PrivateRoute.jsx
│       ├── utils/
│       │   └── api.js        # API client functions
│       └── styles/           # CSS modules
│           ├── index.css     # Global styles
│           ├── Layout.css
│           ├── Auth.css
│           └── Dashboard.css
│
├── README.md                 # This file
├── CATALYST_AUTH_SETUP.md    # Authentication setup guide
├── DESIGN_SYSTEM.md          # Design documentation
└── .gitignore
```

## 🛠️ Development

### Local Development

**Backend**:
```bash
cd server
npm install
npm run dev    # Uses nodemon for auto-reload
```

**Frontend**:
```bash
cd client
npm install
npm run dev    # Vite dev server on port 5173
```

**Note**: In development, Vite proxies `/api` requests to `localhost:3000` (see `vite.config.js`).

### Testing Without Auth

During development, routes are unprotected. Comment out `requireAuth` middleware to test locally.

### Environment Variables

Create `.env` files for local testing:

**server/.env**:
```
NODE_ENV=development
```

**client/.env**:
```
VITE_API_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### "Module not found" on deploy

**Problem**: Dependencies not installed before deploy  
**Solution**: Run `npm install` in both `server/` and `client/` before deploying

### CORS errors

**Problem**: Frontend domain not whitelisted  
**Solution**: Add Slate domain to Authentication → Whitelisting with CORS enabled

### "Authentication required" errors

**Problem**: Auth cookies not sent with requests  
**Solution**: Ensure `credentials: 'include'` in all fetch requests

### Port binding error

**Problem**: Server using wrong port  
**Solution**: Ensure using `process.env.X_ZOHO_CATALYST_LISTEN_PORT`

### Tables not found

**Problem**: Data Store tables not created  
**Solution**: Manually create tables in Catalyst Console with exact schema

## 📚 API Documentation

### Base URL

- **Production**: `https://your-app-appsail.onslate.in`
- **Development**: `http://localhost:3000`

### Endpoints

#### Patients
- `GET /patients` - Get all patients (filter by `?userId=`)
- `GET /patients/:id` - Get single patient
- `POST /patients` - Create patient
- `PATCH /patients/:id` - Update patient

#### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get single doctor
- `POST /doctors` - Create doctor
- `PATCH /doctors/:id` - Update doctor

#### Visits
- `GET /visits` - Get visits (filter by `?doctorId=`, `?patientId=`, `?status=`)
- `GET /visits/:id` - Get single visit with queue position
- `GET /visits/queue/:doctorId` - Get doctor's sorted queue
- `POST /visits` - Create visit (check-in)
- `PATCH /visits/:id` - Update visit (status, priority, notes)

#### Analytics
- `GET /analytics` - Get wait-time analytics

#### Auth
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout

## 🎓 Learning Resources

- [Zoho Catalyst Documentation](https://docs.catalyst.zoho.com/)
- [Catalyst Node.js SDK](https://docs.catalyst.zoho.com/en/sdk/nodejs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 📝 License

This is a student project for the Catalyst Student Club program.

## 👥 Support

For issues or questions:
1. Check [CATALYST_AUTH_SETUP.md](./CATALYST_AUTH_SETUP.md) for auth issues
2. Check [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for styling questions
3. Review Catalyst documentation for platform-specific issues

## 🎉 Demo Checklist

Before presenting:

- [ ] Data Store tables created with correct schema
- [ ] Backend deployed to AppSail (with dependencies installed)
- [ ] Frontend deployed to Slate (with dependencies installed)
- [ ] Authentication configured (roles + CORS)
- [ ] At least one Doctor record created
- [ ] Test patient signup works
- [ ] Test check-in flow works
- [ ] Test doctor queue displays correctly
- [ ] Test urgent priority jumps queue
- [ ] Test analytics dashboard shows data
- [ ] Live URL (`.onslate.in`) accessible

---

**Built with ❤️ for the Catalyst Student Club Program**
