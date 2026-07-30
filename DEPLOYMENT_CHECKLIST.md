# Deployment Checklist for Zoho Catalyst

Complete this checklist in order to successfully deploy the Hospital Queue Management System to Zoho Catalyst.

## 📦 Pre-Deployment

### Local Setup

- [ ] Clone/download project to local machine
- [ ] Install Node.js (version 14 or higher)
- [ ] Verify npm is installed: `npm --version`

### Install Dependencies

**CRITICAL: Must be done BEFORE deploying!**

- [ ] Navigate to `server/` directory
- [ ] Run `npm install` in server folder
- [ ] Verify `server/node_modules/` exists and is populated
- [ ] Navigate to `client/` directory
- [ ] Run `npm install` in client folder
- [ ] Verify `client/node_modules/` exists and is populated

### Install Catalyst CLI

- [ ] Install Catalyst CLI: `npm install -g zcatalyst-cli`
- [ ] Verify installation: `catalyst --version`
- [ ] Login to Catalyst: `catalyst login`

## 🗄️ Data Store Setup

### Create Tables Manually

Navigate to **Catalyst Console → Cloud Scale → Data Store**

#### Table 1: Patients

- [ ] Click "Create Table"
- [ ] Table name: `Patients` (exact spelling)
- [ ] Add columns:
  - [ ] `Name` - Text
  - [ ] `Age` - Number
  - [ ] `Gender` - Text
  - [ ] `Phone` - Text
  - [ ] `BloodGroup` - Text
  - [ ] `UserID` - Text
- [ ] Save table
- [ ] Verify ROWID column auto-created

#### Table 2: Doctors

- [ ] Click "Create Table"
- [ ] Table name: `Doctors` (exact spelling)
- [ ] Add columns:
  - [ ] `Name` - Text
  - [ ] `Specialization` - Text
  - [ ] `Email` - Email
  - [ ] `Phone` - Text
  - [ ] `UserID` - Text
- [ ] Save table
- [ ] Verify ROWID column auto-created

#### Table 3: Visits

- [ ] Click "Create Table"
- [ ] Table name: `Visits` (exact spelling)
- [ ] Add columns:
  - [ ] `PatientID` - Text
  - [ ] `DoctorID` - Text
  - [ ] `VisitDate` - Date
  - [ ] `Reason` - Text
  - [ ] `Status` - Text
  - [ ] `Priority` - Text
  - [ ] `CheckInTime` - DateTime
  - [ ] `ConsultStartTime` - DateTime
  - [ ] `ConsultEndTime` - DateTime
  - [ ] `Notes` - Text
- [ ] Save table
- [ ] Verify ROWID column auto-created

## 🔐 Authentication Setup

### Create Roles

Navigate to **Catalyst Console → Cloud Scale → Authentication → User Management → Roles**

#### Role 1: Patient

- [ ] Click "Add Role"
- [ ] Role Name: `Patient` (exact spelling)
- [ ] Description: "Patients who can self-register"
- [ ] Check "Default Role"
- [ ] Check "Allow Signup"
- [ ] Save role

#### Role 2: Doctor

- [ ] Click "Add Role"
- [ ] Role Name: `Doctor` (exact spelling)
- [ ] Description: "Doctors who manage patient queues"
- [ ] Uncheck "Default Role"
- [ ] Uncheck "Allow Signup"
- [ ] Save role

#### Role 3: Admin

- [ ] Click "Add Role"
- [ ] Role Name: `Admin` (exact spelling)
- [ ] Description: "Reception/Admin staff"
- [ ] Uncheck "Default Role"
- [ ] Uncheck "Allow Signup"
- [ ] Save role

## 🚀 Backend Deployment

### Deploy AppSail

- [ ] Open terminal in `server/` directory
- [ ] Verify `node_modules/` exists (if not, run `npm install`)
- [ ] Run: `catalyst deploy`
- [ ] Select your Catalyst project
- [ ] Confirm AppSail deployment
- [ ] Wait for deployment to complete
- [ ] Note the AppSail URL (e.g., `https://yourapp-appsail.onslate.in`)

### Verify Backend

- [ ] Open AppSail URL in browser
- [ ] Should see: `{"status":"running","message":"Hospital Queue Management API"}`
- [ ] Test endpoint: `GET /doctors` (should return empty array initially)

## 🎨 Frontend Deployment

### Build and Deploy Slate

- [ ] Open terminal in `client/` directory
- [ ] Verify `node_modules/` exists (if not, run `npm install`)
- [ ] Update API URL in `client/src/utils/api.js`:
  ```javascript
  const API_BASE_URL = 'https://your-appsail-url.onslate.in';
  ```
- [ ] Run: `npm run build`
- [ ] Verify `client/dist/` folder was created
- [ ] Run: `catalyst deploy`
- [ ] Select your Catalyst project
- [ ] Confirm Slate deployment
- [ ] Wait for deployment to complete
- [ ] Note the Slate URL (e.g., `https://yourapp.onslate.in`)

### Verify Frontend

- [ ] Open Slate URL in browser
- [ ] Should see login page
- [ ] Verify CSS loads correctly
- [ ] Check browser console for errors

## 🔌 CORS Configuration

### Whitelist Frontend Domain

Navigate to **Catalyst Console → Cloud Scale → Authentication → Whitelisting**

- [ ] Click "Add Domain"
- [ ] Enter your Slate URL (e.g., `https://yourapp.onslate.in`)
- [ ] Check "Enable CORS"
- [ ] Save configuration
- [ ] Wait 2-3 minutes for changes to propagate

### Test CORS

- [ ] Open Slate URL in browser
- [ ] Try to signup/login
- [ ] Check browser console for CORS errors
- [ ] If errors appear, verify domain is whitelisted with CORS enabled

## 🔒 Enable Authentication Middleware

### Update Backend Code

- [ ] Open `server/index.js` in editor
- [ ] Uncomment these lines:
  ```javascript
  const { requireAuth, requireRole } = require('./middleware/auth');
  
  app.use('/patients', requireAuth, patientsRouter);
  app.use('/doctors', requireAuth, doctorsRouter);
  app.use('/visits', requireAuth, visitsRouter);
  app.use('/analytics', requireRole('Admin', 'Doctor'), analyticsRouter);
  ```
- [ ] Save file
- [ ] Redeploy backend: `catalyst deploy` from `server/` directory

## 👥 Create Test Users

### Create Doctor User

Navigate to **Catalyst Console → Cloud Scale → Authentication → User Management → Users**

- [ ] Click "Invite User"
- [ ] Email: doctor@test.com (or your email)
- [ ] Select Role: `Doctor`
- [ ] Send invitation
- [ ] Check email and complete signup
- [ ] Note the user ID from console

### Create Doctor Record

Use API or create manually:

- [ ] POST to `/doctors`:
  ```json
  {
    "Name": "Dr. Sarah Johnson",
    "Specialization": "General Medicine",
    "Email": "doctor@test.com",
    "Phone": "555-0101",
    "UserID": "catalyst_user_id_from_console"
  }
  ```
- [ ] Verify doctor record created

### Create Admin User

- [ ] Click "Invite User"
- [ ] Email: admin@test.com (or your email)
- [ ] Select Role: `Admin`
- [ ] Send invitation
- [ ] Check email and complete signup

## 🧪 Testing

### Test Patient Flow

- [ ] Go to Slate URL
- [ ] Click "Sign up here"
- [ ] Fill out patient signup form
- [ ] Submit signup
- [ ] Login with patient credentials
- [ ] Verify redirected to patient dashboard
- [ ] Try checking in for doctor
- [ ] Verify check-in successful
- [ ] Verify queue position shows

### Test Doctor Flow

- [ ] Logout (if logged in as patient)
- [ ] Login as doctor
- [ ] Verify redirected to doctor dashboard
- [ ] Verify queue shows waiting patients
- [ ] Try starting a consultation
- [ ] Verify status changes to "In Consultation"
- [ ] Try completing consultation
- [ ] Verify status changes to "Completed"

### Test Admin Flow

- [ ] Logout
- [ ] Login as admin
- [ ] Verify redirected to admin dashboard
- [ ] Click "Check In Patient" tab
- [ ] Fill out walk-in patient form
- [ ] Set Priority to "Urgent"
- [ ] Submit check-in
- [ ] Click "All Queues" tab
- [ ] Verify urgent patient appears
- [ ] Try changing priority
- [ ] Click "Analytics Dashboard" tab
- [ ] Verify stats display

### Test Queue Algorithm

- [ ] Check in a Normal priority patient for a doctor
- [ ] Check in an Urgent priority patient for the same doctor
- [ ] Login as that doctor
- [ ] Verify Urgent patient appears FIRST in queue
- [ ] Verify Normal patient appears SECOND
- [ ] Algorithm working! ✅

## 📊 Verify Analytics

- [ ] Login as Admin
- [ ] Go to Analytics Dashboard
- [ ] Verify "Currently Waiting" count is correct
- [ ] Complete a consultation as doctor
- [ ] Refresh admin analytics
- [ ] Verify "Completed Today" incremented
- [ ] Verify "Average Wait Time" calculated

## 🎬 60-Second Demo Preparation

### Demo Script

- [ ] Patient signup and check-in (Normal priority)
- [ ] Admin adds urgent walk-in patient
- [ ] Doctor views queue (urgent first)
- [ ] Doctor processes urgent patient
- [ ] Admin views updated analytics

### Demo Data

- [ ] Create 1-2 sample doctors
- [ ] Have test patient account ready
- [ ] Have admin account ready
- [ ] Have doctor account ready

## ✅ Final Verification

### Functionality Checklist

- [ ] Patient signup works
- [ ] Patient login works
- [ ] Patient check-in works
- [ ] Queue position displays
- [ ] Doctor login works
- [ ] Doctor queue displays (sorted correctly)
- [ ] Doctor can start consultation
- [ ] Doctor can complete consultation
- [ ] Doctor can add notes
- [ ] Admin login works
- [ ] Admin can check in patients
- [ ] Admin can set priority
- [ ] Admin can change priority
- [ ] Analytics display correctly
- [ ] Urgent patients appear first
- [ ] FIFO order within priority levels

### UI Verification

- [ ] Status pills color-coded correctly
  - [ ] Amber for Waiting
  - [ ] Blue for In Consultation
  - [ ] Green for Completed
  - [ ] Red for Urgent
- [ ] Layout looks professional
- [ ] No CSS loading errors
- [ ] Responsive on mobile (test in browser)
- [ ] All buttons work
- [ ] Forms validate properly

### Performance Checks

- [ ] Page loads in < 3 seconds
- [ ] API responses in < 2 seconds
- [ ] No console errors
- [ ] Auto-refresh works (30s interval)

## 🐛 Common Issues & Solutions

### Issue: "Module not found" error

- [ ] Did you run `npm install` before deploying?
- [ ] Check that `node_modules/` exists
- [ ] Re-run `npm install` and redeploy

### Issue: CORS errors

- [ ] Is Slate domain whitelisted?
- [ ] Is CORS checkbox enabled?
- [ ] Wait 2-3 minutes after making changes

### Issue: "Authentication required"

- [ ] Did you enable auth middleware?
- [ ] Are auth cookies being sent?
- [ ] Check `credentials: 'include'` in API calls

### Issue: Tables not found

- [ ] Did you create tables manually in console?
- [ ] Check exact table names (case-sensitive)
- [ ] Verify all columns exist

### Issue: Queue not sorted

- [ ] Check `/visits/queue/:doctorId` endpoint
- [ ] Verify Priority values are "Normal" or "Urgent"
- [ ] Check console for errors

## 📝 Post-Deployment

### Documentation

- [ ] Note your Slate URL
- [ ] Note your AppSail URL
- [ ] Document test user credentials (for demo)
- [ ] Take screenshots for presentation

### Backup

- [ ] Export Data Store tables (if possible)
- [ ] Save configuration settings
- [ ] Keep local copy of code

### Monitoring

- [ ] Check Catalyst Console logs regularly
- [ ] Monitor error rates
- [ ] Watch for performance issues

## 🎓 Presentation Preparation

### Demo Flow

1. [ ] Show patient signup
2. [ ] Show patient check-in
3. [ ] Show reception adding urgent patient
4. [ ] Show doctor queue (algorithm working)
5. [ ] Show consultation flow
6. [ ] Show analytics dashboard

### Talking Points

- [ ] Explain priority queue algorithm
- [ ] Highlight wait-time reduction
- [ ] Demonstrate role-based access
- [ ] Show real-time updates
- [ ] Mention clinical design choices

### Q&A Preparation

- [ ] How does the queue algorithm work?
- [ ] How are urgent cases prioritized?
- [ ] What happens if two patients check in at the same time?
- [ ] Can patients see other patients' information?
- [ ] How is wait time calculated?

---

## ✅ Deployment Complete!

Once all items are checked:

**Your live URL**: `https://yourapp.onslate.in`

**Test Accounts**:
- Patient: (from signup)
- Doctor: doctor@test.com
- Admin: admin@test.com

**Next Steps**:
1. Test all functionality one more time
2. Prepare demo script
3. Take screenshots
4. Practice 60-second demo
5. Submit project! 🎉

---

**Need Help?**
- Check [README.md](./README.md) for detailed docs
- Check [CATALYST_AUTH_SETUP.md](./CATALYST_AUTH_SETUP.md) for auth issues
- Review Catalyst documentation
