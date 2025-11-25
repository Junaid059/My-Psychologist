# 🚀 Quick Start Guide - Admin Dashboard

## 📋 Table of Contents
1. [Setup](#setup)
2. [Login](#login)
3. [Feature Overview](#features)
4. [API Reference](#api-reference)
5. [Database Schema](#database-schema)

---

## ⚡ Setup

### 1. Seed Database
```bash
npm run seed
```
**Output:** 35 records across 9 collections

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access Admin Panel
```
http://localhost:3000/admin/dashboard
```

---

## 🔑 Login

**Admin Credentials:**
- Email: `admin@mypsychologist.com`
- Password: `admin123`

**Test Users:**
- Patient: `john.doe@example.com` / `password123`
- Therapist: `dr.emma.wilson@clinic.com` / `therapist123`

---

## 🎯 Features

### 1. 📅 Session Management
**What:** Manage therapy sessions and appointments
**CRUD:**
- View all sessions
- Cancel with reason
- Track refund status
- Update session details

**Quick Actions:**
- Click session → "Cancel Session"
- Enter reason & refund amount
- Status updates automatically

---

### 2. 💰 Financial Dashboard
**What:** Transaction monitoring and refund processing
**CRUD:**
- View all transactions
- Create new transaction
- Process refunds
- Track payment methods

**Quick Actions:**
- Click transaction → "Process Refund"
- Enter refund amount & notes
- Transaction status updates

**Stats:**
- Total Revenue
- Pending Payments
- Refunded Amount

---

### 3. 📊 Analytics Dashboard
**What:** Real-time statistics and trends
**Data Sources:**
- Users, Bookings, Appointments
- Transactions, Services, Employees

**Features:**
- 6 key metrics
- Monthly charts (6 months)
- Date range filter (week/month/quarter/year)
- Top 5 services
- Top 5 therapists

**No CRUD** - Read-only calculated data

---

### 4. ⚙️ Global Settings
**What:** System-wide configuration
**CRUD:**
- Load current settings
- Update any field
- Auto-saves to database

**Configuration:**
- Currency & Conversion Rates (4 currencies)
- Service Prices (5 types)
- Booking Settings
- Refund Policies
- Notifications (Email, SMS, Push)

**Quick Actions:**
- Change values
- Click "Save All Settings"
- Settings persist

---

### 5. 📚 Content Management
**What:** Educational content library
**CRUD:**
- Create exercises/audios/articles
- View all content by type
- Edit content details
- Delete content

**Content Types:**
- 🏃 Exercises (breathing, meditation)
- 🎵 Meditation Audios
- 📖 Educational Articles

**Quick Actions:**
- Click "Add Content"
- Fill form (title, description, category)
- Select type & status
- Click "Publish Content"

---

### 6. 👮 Community Moderation
**What:** User report management
**CRUD:**
- View reports with details
- Create new report
- Take moderation actions
- Delete old reports

**Actions:**
- 🗑️ Delete Content
- ⚠️ Warn User (+1 warning count)
- 🚫 Suspend User (30 days)
- ❌ Ban User (permanent)
- ✅ Dismiss Report

**Quick Actions:**
- Click "Take Action"
- Select action type
- Add notes
- Execute → User status updates

**Priorities:** Low, Medium, High
**Statuses:** Pending, Resolved, Dismissed

---

### 7. 📢 Announcements
**What:** Broadcast messaging system
**CRUD:**
- Create announcements
- View all messages
- Update/reschedule
- Delete drafts

**Channels:**
- 📧 Email
- 💬 SMS
- 🔔 Push Notifications

**Target Audience:**
- All Users
- Patients Only
- Therapists Only

**Sending Options:**
1. **Send Now** - Immediate delivery
2. **Schedule** - Set date/time
3. **Save as Draft** - Store for later

**Delivery Tracking:**
- Total recipients
- Sent per channel
- Delivered per channel

**Quick Actions:**
- Click "Create New Announcement"
- Write title & message
- Check channels
- Select audience
- Send or schedule

**Protection:** Sent announcements cannot be deleted

---

## 🔌 API Reference

### Sessions
```
GET    /api/admin/appointments
PUT    /api/admin/appointments/[id]
```

### Financial
```
GET    /api/admin/transactions
POST   /api/admin/transactions
PUT    /api/admin/transactions/[id]
```

### Analytics
```
GET    /api/admin/analytics?range={week|month|quarter|year}
```

### Settings
```
GET    /api/admin/settings
PUT    /api/admin/settings
```

### Content
```
GET    /api/admin/content?type={exercise|audio|article}
POST   /api/admin/content
PUT    /api/admin/content/[id]
DELETE /api/admin/content/[id]
```

### Moderation
```
GET    /api/admin/reports?status={pending|resolved|dismissed}
POST   /api/admin/reports
PUT    /api/admin/reports/[id]
DELETE /api/admin/reports/[id]
```

### Announcements
```
GET    /api/admin/announcements?status={draft|scheduled|sent}
POST   /api/admin/announcements
PUT    /api/admin/announcements/[id]
DELETE /api/admin/announcements/[id]
```

**Auth Header Required:**
```javascript
{
  'Authorization': 'Bearer {adminToken}'
}
```

---

## 💾 Database Schema

### Collections (9)

**1. admin_users**
```javascript
{
  email: String,
  password: String (hashed),
  role: 'admin',
  firstName: String,
  lastName: String
}
```

**2. users**
```javascript
{
  firstName, lastName, email, password,
  phone, country, currency,
  userType: 'patient' | 'therapist',
  status: 'active' | 'suspended' | 'banned',
  warningCount: Number,
  suspendedUntil: Date,
  bannedAt: Date
}
```

**3. employees**
```javascript
{
  firstName, lastName, email, password,
  specialization, licenseNumber,
  yearsExperience, rating
}
```

**4. services**
```javascript
{
  name, description, category,
  duration, price, currency
}
```

**5. bookings**
```javascript
{
  userId, serviceId, employeeId,
  bookingDate, bookingTime,
  status, totalPrice
}
```

**6. appointments**
```javascript
{
  userId, employeeId, serviceId,
  appointmentDate, appointmentTime,
  status: 'scheduled' | 'completed' | 'cancelled',
  cancellationReason: String,
  refundStatus: String,
  refundAmount: Number
}
```

**7. transactions**
```javascript
{
  bookingId, userId,
  amount, paymentMethod,
  status: 'pending' | 'completed' | 'refunded',
  refundAmount, notes,
  transactionDate
}
```

**8. reports**
```javascript
{
  reporterId, reportedUserId,
  type: 'post' | 'comment' | 'user',
  reason, description,
  status: 'pending' | 'resolved' | 'dismissed',
  priority: 'low' | 'medium' | 'high',
  action, actionBy, actionDate, notes
}
```

**9. announcements**
```javascript
{
  title, message,
  channels: ['email', 'sms', 'push'],
  targetAudience: 'all' | 'patients' | 'therapists',
  status: 'draft' | 'scheduled' | 'sent',
  scheduledFor, sentAt,
  deliveryStats: {
    totalRecipients, emailSent, smsSent, pushSent,
    emailDelivered, smsDelivered, pushDelivered
  },
  createdBy
}
```

**10. settings** (auto-created)
```javascript
{
  defaultCurrency, conversionRates,
  servicePrices, defaultDuration,
  maxAppointmentsPerDay, advanceBookingDays,
  fullRefundHours, partialRefundHours,
  emailNotifications, smsNotifications, pushNotifications
}
```

**11. content** (created on demand)
```javascript
{
  type: 'exercise' | 'audio' | 'article',
  title, description, category,
  status: 'draft' | 'published',
  fileUrl, views
}
```

---

## 🎯 Common Workflows

### Add New Patient Session
1. Patient books via frontend
2. Creates booking record
3. Creates appointment record
4. Navigate to Sessions tab
5. View new appointment
6. If cancel: Add reason, refund amount

### Process Refund
1. Go to Financial Dashboard
2. Find transaction
3. Click "Process Refund"
4. Enter amount & notes
5. Status → "refunded"

### Send Announcement
1. Go to Announcements
2. Click "Create New Announcement"
3. Write title & message
4. Select channels (email/SMS/push)
5. Choose audience
6. Click "Send Now" or schedule

### Handle User Report
1. Go to Moderation
2. View pending reports
3. Click "Take Action"
4. Select action (warn/suspend/ban)
5. Add notes
6. Execute
7. User status updates automatically

### Update Settings
1. Go to Global Settings
2. Change values
3. Scroll to bottom
4. Click "Save All Settings"
5. Refresh → settings persist

---

## 🔍 Search & Filter

**Sessions:** Filter by status
**Transactions:** Search by amount/user
**Reports:** Search by user/reason, filter by status
**Announcements:** Search by title/message
**Content:** Filter by type (exercise/audio/article)
**Analytics:** Filter by date range

---

## 📱 Responsive Design

All sections work on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

---

## 🎨 UI Features

**Gradients:**
- Sessions: Green
- Financial: Purple
- Analytics: Blue
- Settings: Orange
- Content: Teal
- Moderation: Red
- Announcements: Cyan

**Components:**
- Loading spinners
- Success/error alerts
- Confirmation dialogs
- Form validation
- Empty states
- Icon indicators
- Status badges

---

## 🛠️ Troubleshooting

### No data showing?
1. Check MongoDB is running
2. Run `npm run seed`
3. Check browser console for errors
4. Verify admin token in localStorage

### API errors?
1. Check network tab
2. Verify Authorization header
3. Check MongoDB connection
4. Review server console

### Can't login?
1. Verify email: `admin@mypsychologist.com`
2. Verify password: `admin123`
3. Clear browser cache
4. Check admin_users collection

---

## 📚 Additional Documentation

- **FULL_CRUD_COMPLETE.md** - Comprehensive feature documentation
- **DYNAMIC_INTEGRATION_SUMMARY.md** - Technical implementation details
- **ADMIN_FEATURES_SUMMARY.md** - Original feature specs

---

## 🎉 Quick Stats

- **Features:** 7 fully dynamic
- **API Endpoints:** 24 total
- **Collections:** 9 active
- **Seed Records:** 35 ready
- **CRUD Operations:** All working
- **Loading States:** Everywhere
- **Form Validation:** Complete
- **Auth Security:** JWT-based

---

**Ready to manage your therapy practice! 🚀**
