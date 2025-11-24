# Platform URLs & Feature Reference

## 🏠 Public Pages

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `http://localhost:3000/` | Landing page with services overview |
| Services | `http://localhost:3000/service` | Detailed therapy services |
| About | `http://localhost:3000/about` | Company info and team |
| FAQ | `http://localhost:3000/faq` | Frequently asked questions |
| Contact | `http://localhost:3000/contact` | Contact form and information |
| **Booking** | `http://localhost:3000/booking` | **NEW: Geolocation-based booking** |

---

## 🔐 Authentication

| Page | URL | Purpose |
|------|-----|---------|
| Login | `http://localhost:3000/login` | Unified login for admin & users |
| Admin Login | `http://localhost:3000/admin/login` | Admin-specific login |

### Test Credentials:
```
Admin:
  Email: admin@mypsychologist.com
  Password: admin123

User:
  Email: user@mypsychologist.com
  Password: user123
```

---

## 👨‍💼 Admin Dashboard Pages

| Page | URL | Features |
|------|-----|----------|
| Dashboard Home | `http://localhost:3000/admin/dashboard` | Overview & stats |
| Users | `http://localhost:3000/admin/dashboard?section=users` | User management |
| Bookings | `http://localhost:3000/admin/dashboard?section=bookings` | Booking management |
| Appointments | `http://localhost:3000/admin/dashboard?section=appointments` | Appointment tracking |
| Therapists | `http://localhost:3000/admin/dashboard?section=therapists` | Therapist profiles |
| Revenue | `http://localhost:3000/admin/dashboard?section=revenue` | General revenue analytics |
| **Revenue by Type** | `http://localhost:3000/admin/dashboard?section=therapyRevenue` | **NEW: Breakdown by therapy categories** |
| **Employees** | `http://localhost:3000/admin/dashboard?section=employees` | **NEW: Salary & staff management** |
| **Appointment Mgmt** | `http://localhost:3000/admin/dashboard?section=appointmentMgmt` | **NEW: Advanced scheduling** |
| Reports | `http://localhost:3000/admin/dashboard?section=reports` | Reports & analytics |

---

## 🎯 Key New Features

### 1. Geolocation-Based Booking
- **URL**: `http://localhost:3000/booking`
- **Features**:
  - Automatic country detection (Pakistan/USA)
  - Dynamic currency display (PKR/USD)
  - Price conversion (1 USD = 277 PKR)
  - Location indicator at top
  - Service prices update based on location
  
### 2. Revenue by Therapy Categories
- **URL**: Admin Dashboard → Sidebar → "Revenue by Type"
- **Features**:
  - Revenue breakdown by therapy type
  - Bar chart: Revenue comparison
  - Pie chart: Distribution %
  - Line chart: 6-month trend
  - Detailed breakdown table
  
### 3. Employee Management
- **URL**: Admin Dashboard → Sidebar → "Employees"
- **Features**:
  - Add/Edit/Delete employees
  - Salary and bonus tracking
  - Payment status monitoring
  - Salary distribution chart
  - Employee statistics
  
### 4. Appointment Management
- **URL**: Admin Dashboard → Sidebar → "Appointment Mgmt"
- **Features**:
  - Schedule appointments
  - Track appointment status
  - Change status: Scheduled → Completed/Cancelled/No-Show
  - Client phone number display
  - Session notes
  - Completion rate analytics

---

## 📊 Dashboard Sections (Admin)

### Overview (Home)
- Total Users, Bookings, Appointments
- Recent bookings & activities
- Key metrics cards

### Users
- User list with details
- Search/filter functionality
- User information table

### Bookings
- Upcoming bookings
- Booking history
- Client information
- Booking status

### Appointments (Old)
- Quick appointment view
- Appointment list

### Therapists
- Therapist profiles
- Specializations
- Availability
- Patient count

### Revenue (General)
- Monthly revenue trend
- Payment method breakdown
- Session type revenue
- Average session price

### Revenue by Type (NEW)
- Individual: $45K (40%)
- Couples: $28K (25%)
- Group: $15K (13%)
- Family: $22K (12%)
- Teen: $18K (7%)
- Crisis: $12K (3%)

### Employees (NEW)
- Therapist list: 6 employees
- Total Payroll: $30.5K/month
- Avg Salary: $5,083
- Payment Status tracking

### Appointment Mgmt (NEW)
- Schedule new appointments
- View all appointments
- Change appointment status
- Completion analytics

### Reports
- Generate reports
- Export data
- Analytics

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) to Teal (#14b8a6)
- **Background**: Sky-50, Blue-50, Indigo-50
- **Text Dark**: Slate-900
- **Text Medium**: Slate-600
- **Text Light**: Slate-500
- **Success**: Green-600
- **Warning**: Yellow-600
- **Error**: Red-600

### Gradients
- **Main**: Blue-400 → Teal-400
- **Dark**: Blue-600 → Teal-600
- **Text**: Slate-700 → Slate-800

### Icons (Lucide React)
- Heart (logo)
- Brain (replaced with Heart)
- Calendar, Clock, Users
- DollarSign, Briefcase (new)
- TrendingUp, FileText
- CheckCircle, AlertCircle, XCircle

---

## 🗄️ File Structure

```
/app
  /admin
    /dashboard
      page.tsx
    /login
      page.tsx
  /about
    page.tsx
  /booking
    page.tsx (NEW: geolocation)
  /contact
    page.tsx
  /faq
    page.tsx
  /service
    page.tsx
  layout.tsx
  page.tsx (HOME)

/components
  /admin
    AdminDashboard.tsx (updated)
    Header.tsx
    Sidebar.tsx (updated)
    /sections
      DashboardHome.tsx
      UsersSection.tsx
      BookingsSection.tsx
      AppointmentsSection.tsx
      TherapistsSection.tsx
      RevenueAnalyticsSection.tsx
      TherapyCategoryRevenueSection.tsx (NEW)
      EmployeeManagementSection.tsx (NEW)
      AppointmentManagementSection.tsx (NEW)
      ReportsSection.tsx

/lib
  geolocation.ts (NEW)
  utils.ts

/public
  (images)
```

---

## 🔌 Technology Stack

- **Framework**: Next.js 15.3.4
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Language**: TypeScript
- **Node**: App Router

---

## 📱 Responsive Design

All pages are fully responsive:
- Mobile (320px - 640px)
- Tablet (641px - 1024px)
- Desktop (1025px+)

---

## 🚀 Getting Started

1. **Start Dev Server**:
   ```bash
   npm run dev
   ```

2. **Open Homepage**:
   ```
   http://localhost:3000
   ```

3. **Try Booking**:
   ```
   http://localhost:3000/booking
   ```

4. **Admin Dashboard**:
   ```
   http://localhost:3000/admin/login
   Email: admin@mypsychologist.com
   Password: admin123
   ```

---

## 📚 Documentation Files

- `README.md` - Main project documentation
- `FEATURE_SUMMARY.md` - Detailed feature breakdown
- `QUICK_START_NEW_FEATURES.md` - Quick start guide
- `URLS_REFERENCE.md` - This file

---

**Last Updated**: Current Session  
**Status**: ✅ All features working
