# 🚀 Quick Start: User Personalization Features

## For Users

### 1. **Create Your Account**
```
1. Go to homepage
2. Click "Login" button in navbar
3. Click "Sign up" link
4. Fill in your details:
   - Email
   - Password
   - First Name
   - Last Name
   - Phone (optional)
   - Country
5. Click "Sign Up"
6. You'll be redirected to login
```

### 2. **Login to Your Account**
```
1. Enter your email and password
2. Click "Login"
3. You'll see your profile badge appear in the navbar
```

### 3. **Access Your Profile**
```
Method 1: Click your avatar/name in navbar → "My Profile"
Method 2: Go to /user/profile directly
```

### 4. **Edit Your Profile**
```
1. Open your profile page
2. Click "Edit Profile" button
3. Update any fields:
   - First/Last Name
   - Phone Number
   - Age
   - Location
   - Language preference
   - Bio
   - Emergency Contact
4. Click "Save" to confirm
5. Or "Cancel" to discard changes
```

### 5. **Use Personalized Features**

**Pomodoro Timer** (Your Focus Time)
```
1. Click navbar avatar → "🍅 Pomodoro Timer"
   OR visit /pomodoro
2. All your pomodoro sessions are saved to YOUR account
3. Your tasks are separate from other users
4. Your statistics show YOUR progress only
```

**Mood Journal** (Your Mood Tracking)
```
1. Click navbar avatar → "📊 Mood Journal"
   OR visit /mood-journal
2. All mood entries are saved to YOUR account
3. Your mood history is private
4. Your streaks and analytics are personal
```

### 6. **View Your Statistics**
```
Your profile page shows:
- 🍅 Total pomodoros YOU completed
- ⏰ Total focus hours YOU achieved
- 📊 Total mood entries YOU created
- 📈 YOUR average mood score
- 🔥 YOUR current mood streak
- ✅ Tasks YOU completed
```

### 7. **Logout**
```
1. Click your avatar in navbar
2. Click "Logout" (red button at bottom)
3. Your session ends
4. Login again anytime to access your data
```

---

## For Developers

### Setup Authentication
```typescript
import { getUserId, requireAuth, isLoggedIn } from '@/lib/client-auth';

// In a page component
useEffect(() => {
  if (!requireAuth()) {
    router.push('/user/login');
    return;
  }
  const userId = getUserId();
  // Use userId for API calls
}, []);
```

### Save Data with UserId
```typescript
const userId = getUserId();
if (!userId) {
  alert('Please login first');
  return;
}

const data = {
  userId: userId,
  // ... other fields
};

await fetch('/api/your-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Filter API Data by User
```typescript
// In API route (route.ts)
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  let userId = null;
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    userId = decoded?.id;
  }
  
  // Filter data by userId
  const data = database.find('table_name', (item: any) => 
    item.userId === userId
  );
  
  return NextResponse.json({ data });
}
```

---

## Common Workflows

### New User Journey
```
1. Visit website
2. Sign up
3. Login
4. See profile dropdown in navbar
5. Click "My Profile" to customize
6. Start using Pomodoro and Mood Journal
7. Data saves automatically to their account
8. Check profile for personalized stats
```

### Returning User Journey
```
1. Visit website
2. Already logged in (token in localStorage)
3. Profile dropdown visible
4. Continue using features
5. All previous data loads automatically
6. New data adds to their history
```

### Multi-User Scenario
```
User A:
- Logs in with user_a@email.com
- Creates 5 pomodoro sessions
- Logs 3 mood entries
- Sees only their 5 sessions and 3 entries

User B:
- Logs in with user_b@email.com
- Creates 2 pomodoro sessions
- Logs 8 mood entries
- Sees only their 2 sessions and 8 entries
- CANNOT see User A's data
```

---

## API Endpoints

### Authentication
```
POST /api/auth/user/login
Body: { email, password }
Returns: { token, user }

POST /api/auth/user/signup
Body: { email, password, firstName, lastName, ... }
Returns: { token, user }
```

### Profile
```
GET /api/user/profile
Headers: { Authorization: "Bearer <token>" }
Returns: { user, stats }

PUT /api/user/profile
Headers: { Authorization: "Bearer <token>" }
Body: { firstName, lastName, phone, age, ... }
Returns: { user }
```

### Pomodoro Sessions
```
GET /api/pomodoro/sessions?userId=<userId>
Returns: { sessions } (filtered by userId)

POST /api/pomodoro/sessions
Body: { userId, mode, duration, completedAt, ... }
Returns: { sessionId }
```

### Mood Journal
```
GET /api/mood-journal?userId=<userId>
Returns: { entries } (filtered by userId)

POST /api/mood-journal
Body: { userId, date, moodLevel, emotions, ... }
Returns: { entryId }
```

---

## Security Notes

1. **Passwords**: Never stored in plain text, always hashed
2. **Tokens**: JWT tokens expire after set duration
3. **Data Isolation**: Each user can ONLY access their own data
4. **API Protection**: Backend filters all queries by userId
5. **Client Validation**: Auth checks on protected pages

---

## Troubleshooting

### "Redirected to login page repeatedly"
- Token expired → Login again
- Token invalid → Clear localStorage and login
- Network issue → Check console for errors

### "Can't see my old data"
- Data created before personalization used 'demo-user'
- Create new entries, they'll save to your account
- Old 'demo-user' data won't appear (by design)

### "Profile stats show 0"
- You haven't used features yet
- Complete some pomodoros or mood entries
- Stats update in real-time

### "Can't update profile"
- Check network tab for errors
- Ensure token is valid
- Try logout and login again

---

## Best Practices

### For Users
1. ✅ Keep your password secure
2. ✅ Logout on shared computers
3. ✅ Update profile with emergency contact
4. ✅ Check profile stats regularly for insights

### For Developers
1. ✅ Always check `requireAuth()` on protected pages
2. ✅ Always include userId in data operations
3. ✅ Filter backend queries by userId
4. ✅ Handle token expiration gracefully
5. ✅ Test with multiple user accounts

---

## What's Next?

Future enhancements (not yet implemented):
- 🤖 AI mood analysis and insights
- 📧 Email verification
- 🔑 Password reset
- 📷 Avatar image upload
- 📊 Advanced analytics dashboards
- 🏆 Achievement badges
- 👥 Social features

---

**Enjoy your personalized mental health journey! 🎉**
