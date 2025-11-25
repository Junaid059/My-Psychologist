# 🎭 GUEST MODE + UNIFIED LOGIN SYSTEM

## Overview
The platform now supports **both guest users and logged-in users** with a unified login experience for both regular users and admins.

---

## ✨ What Changed

### 1. **Guest Mode (Anonymous Usage)**
- ✅ Anyone can use **Pomodoro Timer** without logging in
- ✅ Anyone can use **Mood Journal** without logging in
- ⚠️ **Guest sessions and mood entries are NOT saved to database**
- 🎯 **Purpose**: Let people try features before committing to signup

### 2. **Unified Login System**
- ✅ Single login page at `/login` for both users and admins
- ✅ Same login form works for both user types
- ✅ Automatically detects user type (admin vs regular user)
- ✅ Redirects appropriately:
  - **Admin** → `/admin/dashboard`
  - **User** → `/` (homepage with profile dropdown)

### 3. **Data Persistence Rules**
```
GUEST MODE:
- Can use all features
- Data exists only in current session (browser memory)
- Data disappears on page refresh
- No backend storage

LOGGED IN:
- All sessions saved to database
- Data persists across devices
- Full history tracking
- Stats and analytics available
```

---

## 🔧 Technical Implementation

### Updated Files

**1. `/app/login/page.tsx`** (Original unified login)
```typescript
// Tries admin login first, then user login
// Stores appropriate tokens:
// - Admin: 'adminToken' + 'admin'
// - User: 'userToken' + 'user'
```

**2. `/app/pomodoro/page.tsx`**
```typescript
// BEFORE: Required login, redirected to /user/login
// AFTER: Guest mode allowed

const [isGuest, setIsGuest] = useState(false);

useEffect(() => {
  const id = getUserId();
  if (id) {
    setUserId(id);
    setIsGuest(false);
  } else {
    setIsGuest(true); // Guest mode enabled
  }
}, []);

// Save session only if logged in
const saveSession = async () => {
  if (isGuest || !userId) {
    console.log('🎭 Guest mode - Session not saved');
    return;
  }
  // ... save to backend
};
```

**3. `/app/mood-journal/page.tsx`**
```typescript
// BEFORE: Required login, redirected to /user/login
// AFTER: Guest mode allowed

const [isGuest, setIsGuest] = useState(false);

useEffect(() => {
  const id = getUserId();
  if (id) {
    setUserId(id);
    setIsGuest(false);
  } else {
    setIsGuest(true); // Guest mode enabled
  }
}, []);

// Save entry only if logged in
const handleSubmitEntry = async () => {
  // ... create entry in memory
  
  if (!isGuest && userId) {
    // Save to backend
  } else {
    console.log('🎭 Guest mode - Entry not saved');
  }
};
```

**4. `/app/page.tsx`** (Homepage navbar)
```typescript
// Updated login button to use /login instead of /user/login
<Link href="/login">Login</Link>

// Check both token locations for backward compatibility
const userToken = localStorage.getItem('userToken') || localStorage.getItem('user_token');
const userData = localStorage.getItem('user') || localStorage.getItem('user_data');
```

**5. `/lib/client-auth.ts`**
```typescript
// Updated to check BOTH old and new token locations
export function getUserId(): string | null {
  const token = localStorage.getItem('userToken') || localStorage.getItem('user_token');
  // ...
}

export function isLoggedIn(): boolean {
  const token = localStorage.getItem('userToken') || localStorage.getItem('user_token');
  const user = localStorage.getItem('user') || localStorage.getItem('user_data');
  return !!(token && user);
}

// Default redirect changed to /login
export function requireAuth(redirectTo: string = '/login'): boolean {
  // ...
}
```

---

## 🎨 User Experience

### Guest User Journey
```
1. Visit /pomodoro or /mood-journal
2. See amber banner: "Guest Mode - Login to Save"
3. Use features normally
4. Complete pomodoro session → Works but not saved
5. Add mood entry → Works but not saved
6. Refresh page → Data disappears
7. Click "Login to Save" → Go to /login
8. After login → Data starts saving automatically
```

### Logged-in User Journey
```
1. Visit /login
2. Enter credentials (works for both user/admin)
3. If user → Homepage with profile dropdown
4. Use /pomodoro or /mood-journal
5. NO amber banner (already logged in)
6. Complete session/entry → SAVED to database
7. Check profile → See all stats
8. Data persists forever
```

### Admin Journey
```
1. Visit /login
2. Enter admin credentials
3. Redirect to /admin/dashboard
4. Admin features isolated from user features
```

---

## 🎯 Guest Mode Banner

Both Pomodoro and Mood Journal show this banner when not logged in:

```tsx
{isGuest && (
  <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4">
    <div className="flex items-center gap-3">
      <AlertCircle icon in amber />
      <div>
        <p className="font-semibold text-amber-900">Guest Mode</p>
        <p className="text-sm text-amber-700">
          You can use the timer/track mood, but data won't be saved
        </p>
      </div>
    </div>
    <Link href="/login" className="...">
      Login to Save
    </Link>
  </div>
)}
```

**Design:**
- Amber/orange gradient (warm, inviting)
- Alert icon for visibility
- Clear messaging about guest limitations
- Prominent "Login to Save" CTA button
- Non-intrusive placement (top of page)

---

## 📊 Data Storage Comparison

| Feature | Guest Mode | Logged In |
|---------|-----------|-----------|
| **Pomodoro Timer** | ✅ Works | ✅ Works |
| **Task Management** | ✅ Works (localStorage) | ✅ Works (localStorage) |
| **Session Saving** | ❌ Not saved | ✅ Saved to DB |
| **Session History** | ❌ No history | ✅ Full history |
| **Statistics** | ❌ No stats | ✅ Full analytics |
| **Mood Journal** | ✅ Works | ✅ Works |
| **Mood Entry Saving** | ❌ Not saved | ✅ Saved to DB |
| **Mood Analytics** | ❌ No analytics | ✅ Charts & insights |
| **Profile Page** | ❌ No access | ✅ Full profile |
| **Data Persistence** | ❌ Session only | ✅ Forever |

---

## 🔐 LocalStorage Keys

### User Authentication (New System)
```
userToken: JWT token for regular users
user: User profile object
```

### Legacy Support (Still Checked)
```
user_token: Old JWT token key
user_data: Old user profile key
```

### Admin Authentication
```
adminToken: JWT token for admins
admin: Admin profile object
```

### Feature Data
```
pomodoro_tasks: Task list (not user-specific)
pomodoro_sessions: Loaded from API (user-specific)
mood_entries: Loaded from API (user-specific)
```

---

## 🚀 How to Test

### Test Guest Mode
```bash
1. Clear localStorage (DevTools → Application → Clear)
2. Visit http://localhost:3000/pomodoro
3. Should see amber "Guest Mode" banner
4. Complete a pomodoro session
5. Check console: "🎭 Guest mode - Session not saved"
6. Refresh page → No sessions in history
7. Click "Login to Save" → Redirected to /login
```

### Test Logged-in Mode
```bash
1. Go to /login
2. Login with user credentials
3. Visit /pomodoro
4. Should NOT see "Guest Mode" banner
5. Complete a pomodoro session
6. Check console: "✅ Session saved to database"
7. Refresh page → Sessions still there
8. Check profile → See stats updated
```

### Test Admin vs User
```bash
Admin:
1. Go to /login
2. Use admin@example.com
3. → Redirected to /admin/dashboard

User:
1. Go to /login
2. Use user@example.com
3. → Redirected to homepage
4. → Profile dropdown visible in navbar
```

---

## ⚠️ Important Notes

### For Users
1. **Guest mode is temporary** - Data exists only until page refresh
2. **Login to keep your progress** - All history preserved
3. **One login page** - Same form for everyone (/login)
4. **Auto-detection** - System knows if you're admin or user

### For Developers
1. **Always check `isGuest` before saving to backend**
2. **Support both token locations** for backward compatibility
3. **Guest mode uses 'guest' as userId** in memory
4. **Don't send guest data to API** - it will be rejected
5. **Banner component reusable** across features

---

## 🎭 Guest Mode Philosophy

### Why Allow Guest Access?
- **Lower barrier to entry** - Try before signup
- **Privacy-conscious users** - Can explore anonymously
- **Demo purposes** - Show features without account
- **Progressive engagement** - Hook users, then convert

### Conversion Strategy
```
Guest User → See features work → Want to save progress 
→ See "Login to Save" banner → Click → Signup → Converted! ✅
```

---

## 🔄 Migration Notes

### Old System (Before)
```
- /user/login for users
- Separate authentication
- Required login for all features
- Blocked guest access
```

### New System (After)
```
- /login for everyone
- Unified authentication
- Guest mode allowed
- Progressive authentication
```

### Backward Compatibility
```typescript
// Still supports old localStorage keys
const token = localStorage.getItem('userToken') || localStorage.getItem('user_token');
const user = localStorage.getItem('user') || localStorage.getItem('user_data');
```

---

## 📝 Console Messages

### Guest Mode
```
🎭 Guest mode - Sessions will not be saved
🎭 Guest mode - Mood entries will not be saved
🎭 Guest mode - Session not saved
🎭 Guest mode - Entry not saved to database
```

### Logged-in Mode
```
✅ Mood entry saved to database
✅ Session saved to database
```

---

## 🎉 Summary

### What Works Now
✅ Guest users can try Pomodoro Timer  
✅ Guest users can try Mood Journal  
✅ Logged-in users get full data persistence  
✅ Single login page for all users  
✅ Admin vs User auto-detection  
✅ Profile dropdown for logged-in users  
✅ Guest mode banners with "Login to Save" CTA  
✅ Backward compatible with old tokens  

### User Benefits
- 🆓 Free exploration without signup
- 🔐 Secure data when logged in
- 📊 Full analytics for members
- 🎯 Simple one-page login
- 💾 Persistent history for users

### Developer Benefits
- 🧩 Clean code separation
- 🔄 Easy guest/user mode toggle
- 🛡️ Secure by default
- 📦 Modular authentication
- 🎨 Reusable banner component

---

**Guest-friendly, conversion-optimized, privacy-respecting! 🎊**
