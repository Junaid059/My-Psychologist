# Quick Start Guide - New Features

## 🎯 How to Access New Features

### 1. Testing Logo Changes
All pages now display the Heart icon instead of Brain:
- Homepage: `/`
- Services: `/service`
- About: `/about`
- Contact: `/contact`
- FAQ: `/faq`
- Booking: `/booking`
- Admin Dashboard: `/admin/dashboard`

---

### 2. Testing Location-Based Pricing

#### On the Booking Page (`/booking`):
1. Open http://localhost:3000/booking
2. You'll see a location indicator showing your detected country
3. Currency and prices automatically adjust:
   - **If detected as Pakistan**: Prices in PKR (₨)
   - **If detected as USA**: Prices in USD ($)
4. Service cards show converted prices
5. Example conversion:
   - Individual Therapy: $150 USD = ₨41,550 PKR

#### Testing from Different Locations:
- Use browser DevTools (F12 → Sensors tab) to mock geolocation
- Or the app will fall back to IP-based geolocation

---

### 3. Accessing Admin Dashboard

#### Login:
1. Go to `/admin/login` or `/login`
2. Enter admin credentials:
   ```
   Email: admin@mypsychologist.com
   Password: admin123
   ```
3. Click "Admin Dashboard" after login

#### New Admin Sections:

##### **Revenue by Therapy Categories** (`Revenue by Type`)
- **Location**: Admin Dashboard → Sidebar → "Revenue by Type"
- **Shows**:
  - Revenue breakdown for each therapy type
  - Bar chart of revenue by category
  - Pie chart showing distribution %
  - 6-month trend line chart
  - Detailed breakdown table
  - Key metrics: Total revenue, sessions, avg price

##### **Employee Management** (`Employees`)
- **Location**: Admin Dashboard → Sidebar → "Employees"
- **Features**:
  - Add new employee
  - View all therapists with salaries
  - Track payment status (Paid/Pending/Overdue)
  - Edit/Delete employees
  - Salary distribution chart
  - Key metrics: Total payroll, avg salary, payments due
  - Edit and delete buttons on each row

##### **Appointment Management** (`Appointment Mgmt`)
- **Location**: Admin Dashboard → Sidebar → "Appointment Mgmt"
- **Features**:
  - Schedule new appointment (click "Add Appointment")
  - Fill in: Client name, therapist, date, time, type, duration, phone, notes
  - View all appointments in table
  - Change appointment status via dropdown:
    - Scheduled (blue)
    - Completed (green)
    - Cancelled (red)
    - No-Show (yellow)
  - Edit/Delete appointments
  - Statistics dashboard with:
    - Completion rate
    - Average duration
    - Most common type
    - Cancellation rate

---

## 💰 Testing Geolocation & Pricing

### Step 1: Check Current Location
1. Open DevTools (F12)
2. Go to Console tab
3. If you see no errors, geolocation is working

### Step 2: Mock Pakistan Location
```javascript
// In browser console:
localStorage.setItem('userLocation', JSON.stringify({
  country: 'Pakistan',
  currency: 'PKR',
  currencySymbol: '₨',
  exchangeRate: 1
}));
localStorage.setItem('userLocationTime', Date.now().toString());
// Refresh page
```

### Step 3: Mock USA Location
```javascript
// In browser console:
localStorage.setItem('userLocation', JSON.stringify({
  country: 'USA',
  currency: 'USD',
  currencySymbol: '$',
  exchangeRate: 277
}));
localStorage.setItem('userLocationTime', Date.now().toString());
// Refresh page
```

---

## 📊 Sample Data

### Therapy Revenue Breakdown:
- Individual: $45,000 (40%)
- Couples: $28,000 (25%)
- Group: $15,000 (13%)
- Family: $22,000 (12%)
- Teen: $18,000 (7%)
- Crisis: $12,000 (3%)
- **Total**: $140,000

### Employees:
- Dr. Sarah Johnson - Individual, $5,000 + $1,200 bonus
- Dr. Michael Chen - Couples, $5,500 + $1,500 bonus
- Dr. Emma Williams - CBT, $4,800 + $800 bonus
- Dr. James Rodriguez - Crisis, $5,200 + $1,000 bonus
- Dr. Lisa Anderson - Family, $5,100 + $900 bonus
- Dr. David Kim - Teen, $4,900 + $700 bonus

### Sample Appointments:
- John Doe → Dr. Sarah Johnson - Individual, Jan 15, 10:00 AM (Scheduled)
- Jane Smith → Dr. Michael Chen - Couples, Jan 15, 2:00 PM (Scheduled)
- Robert Johnson → Dr. Emma Williams - Individual, Jan 14, 3:00 PM (Completed)
- Emily Brown → Dr. Lisa Anderson - Family, Jan 10, 11:00 AM (Completed)
- Michael Davis → Dr. David Kim - Teen, Jan 12, 4:00 PM (Cancelled)
- Sarah Wilson → Dr. James Rodriguez - Crisis, Jan 16, 9:00 AM (Scheduled)

---

## 🛠️ Code Structure

### New Files Created:
```
components/admin/sections/
├── TherapyCategoryRevenueSection.tsx (Revenue by therapy types)
├── EmployeeManagementSection.tsx (Employee/salary management)
└── AppointmentManagementSection.tsx (Appointment scheduling)

lib/
└── geolocation.ts (Location detection & pricing)
```

### Modified Files:
```
components/admin/
├── AdminDashboard.tsx (Added routing for new sections)
└── Sidebar.tsx (Added new menu items)

app/
├── login/page.tsx (Heart icon)
├── page.tsx (Heart icon)
├── about/page.tsx (Heart icon)
├── contact/page.tsx (Heart icon)
├── service/page.tsx (Heart icon)
├── faq/page.tsx (Heart icon)
└── booking/page.tsx (Geolocation & dynamic pricing)
```

---

## 🐛 Troubleshooting

### Location Not Detecting?
1. Check browser console for errors
2. Allow location permission when browser asks
3. Check if using HTTPS (required for some geolocation APIs)
4. Fall back to IP-based geolocation works without permission

### Prices Not Updating?
1. Check localStorage for cached location
2. Clear cache: Press Ctrl+Shift+Del → Clear browsing data
3. Check browser console for any errors
4. Verify geolocation utility is imported correctly

### Admin Dashboard Not Loading?
1. Make sure you're logged in as admin
2. Check `/admin/dashboard` URL directly
3. Verify browser console for errors
4. Clear localStorage and login again

---

## ✨ Features Checklist

- [x] Brain → Heart icon conversion across all pages
- [x] Revenue by therapy categories section
- [x] Employee/salary management section
- [x] Appointment scheduling/management section
- [x] Geolocation detection (Pakistan/USA)
- [x] Dynamic pricing (PKR/USD)
- [x] Location-based currency display
- [x] Admin dashboard menu integration
- [x] Responsive design
- [x] Data visualization with Recharts

---

**Need Help?** Check the browser console for any error messages and refer to the main README.md
