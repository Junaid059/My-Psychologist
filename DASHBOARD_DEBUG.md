# 🔧 USER DASHBOARD - DEBUG & FIX

## ❌ Error: "Failed to fetch dashboard data"

I've added **extensive logging** to help debug the issue.

---

## 🔍 What to Do Now:

### Step 1: Refresh Dashboard
1. Go to `http://localhost:3000/user/dashboard`
2. Open **Browser Console** (`F12` → Console tab)
3. Look at the **Terminal** where Next.js is running

### Step 2: Check Browser Console Logs

You should see:
```
🔐 Token found, fetching dashboard...
📋 User from localStorage: {id: "...", email: "junaid@gmail.com"}
📡 Dashboard API response status: 404 (or 200)
```

If status is **404**, you'll also see:
```
❌ API Error: {error: "User not found", userId: "...", debug: "..."}
```

### Step 3: Check Server Terminal Logs

Look for:
```
🔍 Dashboard API - Looking for user: user_1764067776133_7r31wcznf
```

Then one of:
- ✅ `User found: junaid@gmail.com` (SUCCESS!)
- ❌ `User not found in MongoDB` (PROBLEM!)

If user not found, you'll see:
```
📋 Sample users: [{id: "...", _id: "...", email: "..."}]
```

---

## 🐛 What the Logs Tell You:

### Scenario A: User ID Mismatch
```
Token userId: user_1764067776133_7r31wcznf
MongoDB userId: user_001 or different format
```
**Fix:** Need to update how we match users

### Scenario B: User Not in MongoDB
```
📋 Sample users: []  (empty array)
```
**Fix:** User wasn't created during signup

### Scenario C: Success!
```
✅ User found: junaid@gmail.com
```
**Fix:** Dashboard should load! 🎉

---

## ✅ Quick Fixes:

### Fix 1: Logout & Login Again
```
1. Click profile icon → Logout
2. Go to http://localhost:3000/login
3. Login with junaid@gmail.com
4. Try dashboard again
```

### Fix 2: Check What's in MongoDB
```bash
mongosh
use my-psychologist
db.users.findOne({ email: "junaid@gmail.com" })
```

Look at the `id` field - does it match the token?

---

## 📝 Copy These Logs Here:

After refreshing the dashboard, **copy and send me**:

1. **From Browser Console:**
   ```
   (paste all logs starting with 🔐, 📋, 📡, ✅ or ❌)
   ```

2. **From Server Terminal:**
   ```
   (paste all logs starting with 🔍, ✅ or ❌)
   ```

Then I can tell you exactly what's wrong and how to fix it!

---

## 🎯 What I Fixed:

1. **Added user lookup with both ID formats:**
   - Tries `{ id: userId }`
   - Tries `{ _id: ObjectId(userId) }`

2. **Added debug logging:**
   - Shows what userId we're looking for
   - Shows sample users if not found
   - Shows user email if found

3. **Better error messages:**
   - Returns userId in error
   - Tells you to check console

**Refresh the dashboard now and let me know what you see!** 🔧
