# Quick Start Guide - Hospital Queue Management

Get your Hospital Queue & Wait-Time Management System up and running in 30 minutes.

## 📋 Prerequisites

- [ ] Zoho Catalyst account
- [ ] Node.js 14+ installed
- [ ] Catalyst CLI installed: `npm install -g zcatalyst-cli`
- [ ] Logged into CLI: `catalyst login`

## ⚡ 5-Minute Local Test

Want to see it working locally first? Follow these steps:

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Start Backend

```bash
cd server
npm run dev
# Runs on http://localhost:3000
```

### 3. Start Frontend (in new terminal)

```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### 4. Open Browser

Visit: `http://localhost:5173`

You'll see the login page. Since there's no real auth yet, use the mock login:
- Email: `patient@test.com` → Redirects to Patient view
- Email: `doctor@test.com` → Redirects to Doctor view
- Email: `admin@test.com` → Redirects to Admin view

---

## 🚀 Deploy to Catalyst (The Real Thing)

### Step 1: Create Data Store Tables (10 min)

1. Open Catalyst Console
2. Go to **Cloud Scale → Data Store**
3. Create these 3 tables:

#### Patients Table
```
Table Name: Patients
Columns:
- Name (Text)
- Age (Number)
- Gender (Text)
- Phone (Text)
- BloodGroup (Text)
- UserID (Text)
```

#### Doctors Table
```
Table Name: Doctors
Columns:
- Name (Text)
- Specialization (Text)
- Email (Email)
- Phone (Text)
- UserID (Text)
```

#### Visits Table
```
Table Name: Visits
Columns:
- PatientID (Text)
- DoctorID (Text)
- VisitDate (Date)
- Reason (Text)
- Status (Text)
- Priority (Text)
- CheckInTime (DateTime)
- ConsultStartTime (DateTime)
- ConsultEndTime (DateTime)
- Notes (Text)
```

**Don't create an ID column - ROWID is auto-generated!**

### Step 2: Deploy Backend (2 min)

```bash
cd server
# Make sure node_modules exists (run npm install if not)
catalyst deploy
```

Note your AppSail URL (e.g., `https://yourapp-appsail.onslate.in`)

### Step 3: Update Frontend API URL (1 min)

Edit `client/src/utils/api.js`:

```javascript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-appsail-url.onslate.in'  // <-- Change this
  : '/api';
```

### Step 4: Deploy Frontend (2 min)

```bash
cd client
npm run build
catalyst deploy
```

Note your Slate URL (e.g., `https://yourapp.onslate.in`)

### Step 5: Configure Authentication (5 min)

1. **Create Roles**:
   - Console → Cloud Scale → Authentication → Roles
   - Create: `Patient` (default, allow signup)
   - Create: `Doctor` (no signup)
   - Create: `Admin` (no signup)

2. **Whitelist Domain**:
   - Console → Cloud Scale → Authentication → Whitelisting
   - Add your Slate URL
   - Enable CORS checkbox

### Step 6: Create Test Doctor (3 min)

1. **Invite Doctor User**:
   - Console → Authentication → Users → Invite
   - Email: your-email@example.com
   - Role: Doctor
   - Check email and complete signup

2. **Create Doctor Record**:
   - Use Postman or curl to POST to `/doctors`:
   ```bash
   curl -X POST https://your-appsail-url.onslate.in/doctors \
     -H "Content-Type: application/json" \
     -d '{
       "Name": "Dr. Sarah Johnson",
       "Specialization": "General Medicine",
       "Email": "your-email@example.com",
       "Phone": "555-0101",
       "UserID": "YOUR_CATALYST_USER_ID"
     }'
   ```
   (Get UserID from Catalyst Console → Users)

### Step 7: Enable Auth Middleware (1 min)

Edit `server/index.js` - uncomment these lines:

```javascript
const { requireAuth, requireRole } = require('./middleware/auth');

app.use('/patients', requireAuth, patientsRouter);
app.use('/doctors', requireAuth, doctorsRouter);
app.use('/visits', requireAuth, visitsRouter);
app.use('/analytics', requireRole('Admin', 'Doctor'), analyticsRouter);
```

Redeploy backend:
```bash
cd server
catalyst deploy
```

### Step 8: Test! (5 min)

1. **Open your Slate URL** in browser

2. **Sign up as Patient**:
   - Click "Sign up here"
   - Fill out form
   - Login with new credentials

3. **Check in**:
   - Select doctor
   - Enter reason
   - Submit check-in
   - Verify queue position shows

4. **Login as Doctor**:
   - Logout
   - Login with doctor credentials
   - Verify queue shows patient
   - Click "Start" → "Complete"
   - Verify status changes

5. **Test Admin** (optional):
   - Invite admin user
   - Login as admin
   - Check Analytics tab
   - Verify metrics display

---

## 🎬 Demo Script (60 seconds)

### Setup (do before demo):
- Open Slate URL in 3 browser windows:
  - Window 1: Patient view (logged in)
  - Window 2: Doctor view (logged in)
  - Window 3: Admin view (logged in)

### Demo Flow:

**[0:00-0:15] Patient Check-In**
- Window 1: Patient checks in (Normal priority)
- Show queue position

**[0:15-0:25] Admin Adds Urgent**
- Window 3: Admin tab → Check In Patient
- Create urgent walk-in
- Set Priority to "Urgent"

**[0:25-0:40] Doctor Queue**
- Window 2: Doctor dashboard
- **Point out**: Urgent patient is #1
- **Point out**: Normal patient is #2
- "Algorithm working! Urgent first, then FIFO"

**[0:40-0:50] Process Patient**
- Click "Start" on urgent patient
- Add quick notes
- Click "Complete"

**[0:50-1:00] Analytics**
- Window 3: Analytics tab
- Show updated metrics
- "Real-time analytics tracking wait times"

**Done!** 🎉

---

## 🐛 Quick Troubleshooting

### Can't deploy?
```bash
# Make sure dependencies are installed
cd server && npm install
cd ../client && npm install
```

### CORS errors?
- Check Slate domain is whitelisted
- Verify CORS checkbox is enabled
- Wait 2-3 minutes after making changes

### "Authentication required"?
- Did you enable auth middleware?
- Are you logged in?
- Check browser cookies are enabled

### Tables not found?
- Verify table names are exact: `Patients`, `Doctors`, `Visits`
- Check all columns exist
- Verify ROWID was auto-generated

### Queue not sorting?
- Check Priority values: "Normal" or "Urgent"
- Verify `/visits/queue/:doctorId` endpoint works
- Check console for errors

---

## 📚 Full Documentation

For detailed information, see:

- **README.md** - Complete project documentation
- **DEPLOYMENT_CHECKLIST.md** - Detailed deployment steps
- **DATA_STORE_SCHEMA.md** - Exact table schemas
- **CATALYST_AUTH_SETUP.md** - Authentication details
- **DESIGN_SYSTEM.md** - UI/UX documentation

---

## ✅ You're Done!

Your Hospital Queue Management System is live at:

**🌐 Your URL**: `https://yourapp.onslate.in`

### Test All Features:
- [ ] Patient signup
- [ ] Patient check-in
- [ ] Queue position display
- [ ] Doctor login
- [ ] Queue shows sorted (Urgent first)
- [ ] Start consultation
- [ ] Complete consultation
- [ ] Admin login
- [ ] Analytics display
- [ ] Urgent priority works

### Ready to Present? 
- [ ] Practice 60-second demo
- [ ] Prepare to explain algorithm
- [ ] Screenshot key features
- [ ] Test one more time!

**Good luck!** 🚀
