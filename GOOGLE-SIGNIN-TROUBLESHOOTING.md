# 🔍 Google Sign-In Troubleshooting Guide

## Current Status
You've added the ALB domain to Firebase authorized domains, but Google Sign-in is still not working.

---

## 🛠️ Step-by-Step Debugging

### Step 1: Clear Browser Cache & Cookies
Firebase caches authorization settings in the browser.

**Chrome/Edge**:
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "All time"
3. Check: Cookies, Cached images and files
4. Click "Clear data"
5. **Restart browser completely**

**Or use Incognito/Private mode**:
- Chrome: `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
- Test Google Sign-in in incognito window

---

### Step 2: Wait for Firebase Propagation
Firebase authorized domains can take **5-10 minutes** to propagate globally.

**What to do**:
- Wait 10 minutes after adding the domain
- Try again in a fresh incognito window
- Check Firebase Console to confirm domain is saved

---

### Step 3: Check Browser Console for Errors

1. Open your application: http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/signin
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Click "Sign in with Google"
5. Look for error messages

**Common Errors & Solutions**:

#### Error: `auth/unauthorized-domain`
```
Firebase: Error (auth/unauthorized-domain)
```
**Solution**: Domain not added correctly to Firebase
- Go back to Firebase Console
- Verify domain is in the list: `bitedash-alb-443240071.us-east-1.elb.amazonaws.com`
- Make sure there are no typos or extra spaces
- Wait 10 minutes and try again

#### Error: `auth/popup-blocked`
```
Popup blocked by browser
```
**Solution**: Allow popups for this site
- Click the popup icon in address bar
- Select "Always allow popups from this site"
- Try again

#### Error: `auth/popup-closed-by-user`
```
The popup has been closed by the user before finalizing the operation
```
**Solution**: This is normal if you closed the popup
- Try clicking "Sign in with Google" again
- Complete the Google sign-in flow

#### Error: CORS or Network Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Backend CORS issue
- This shouldn't happen (already configured)
- If you see this, let me know

---

### Step 4: Verify Firebase Configuration

Open browser console and run:
```javascript
// Check if Firebase is initialized
console.log('Firebase Config:', {
  authDomain: 'vingo-b3fd6.firebaseapp.com',
  projectId: 'vingo-b3fd6'
});

// Check current URL
console.log('Current URL:', window.location.href);
```

**Expected**:
- authDomain: `vingo-b3fd6.firebaseapp.com`
- Current URL: `http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/signin`

---

### Step 5: Test Backend Endpoint Directly

Open browser console and run:
```javascript
// Test if backend Google auth endpoint works
fetch('http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/api/auth/google-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    fullName: 'Test User',
    email: 'test@gmail.com',
    mobile: '1234567890',
    role: 'user'
  })
})
.then(r => r.json())
.then(d => console.log('Backend Response:', d))
.catch(e => console.error('Backend Error:', e));
```

**Expected**: Should return user object or error message (not CORS error)

---

### Step 6: Check Firebase Console Settings

1. Go to: https://console.firebase.google.com/
2. Select project: **vingo-b3fd6**
3. Go to: **Authentication** → **Sign-in method**
4. Verify **Google** provider is **Enabled**
5. Go to: **Authentication** → **Settings** → **Authorized domains**
6. Verify these domains are listed:
   - ✅ `vingo-b3fd6.firebaseapp.com` (default)
   - ✅ `localhost` (for development)
   - ✅ `bitedash-alb-443240071.us-east-1.elb.amazonaws.com` (your ALB)

**Screenshot what you see** if domains are not listed correctly.

---

### Step 7: Test with Different Google Account

Sometimes Google accounts have restrictions:
- Try signing in with a **personal Gmail account** (not work/school)
- Try a different browser (Firefox, Safari, Edge)
- Try on a different device (phone, tablet)

---

## 🔧 Alternative Solutions

### Solution 1: Use Email/Password Authentication (Already Working)
If Google Sign-in is critical but not working:
1. Use email/password sign-up (this works perfectly)
2. Users can create accounts with email
3. Fix Google Sign-in later when you have more time

### Solution 2: Create New Firebase Project
If you don't have access to the current Firebase project or can't modify it:

1. **Create New Firebase Project**:
   - Go to: https://console.firebase.google.com/
   - Click "Add project"
   - Name: "BiteDash"
   - Enable Google Analytics (optional)
   - Create project

2. **Enable Google Authentication**:
   - Go to: Authentication → Get started
   - Click "Sign-in method" tab
   - Enable "Google" provider
   - Add authorized domains:
     - `localhost`
     - `bitedash-alb-443240071.us-east-1.elb.amazonaws.com`

3. **Get Firebase Config**:
   - Go to: Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "Web" icon (</>) to add web app
   - Register app name: "BiteDash Web"
   - Copy the firebaseConfig object

4. **Update Frontend Code**:
   ```javascript
   // frontend/src/firebase.js
   const firebaseConfig = {
     apiKey: "YOUR_NEW_API_KEY",
     authDomain: "bitedash-xxxxx.firebaseapp.com",
     projectId: "bitedash-xxxxx",
     storageBucket: "bitedash-xxxxx.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

5. **Update Environment Variable**:
   ```bash
   # frontend/.env.production
   VITE_FIREBASE_APIKEY="YOUR_NEW_API_KEY"
   ```

6. **Rebuild and Deploy**:
   ```bash
   cd frontend
   npm run build
   # Push to GitHub to trigger CI/CD
   ```

### Solution 3: Add Custom Domain (Recommended)
Firebase works better with custom domains:

1. **Get a domain** (e.g., bitedash.com)
2. **Set up HTTPS** with AWS Certificate Manager
3. **Add custom domain** to Firebase authorized domains
4. **Update application** to use custom domain

This is the **best long-term solution** for production.

---

## 🧪 Quick Test Checklist

Run through this checklist:

- [ ] Cleared browser cache and cookies
- [ ] Tried in incognito/private window
- [ ] Waited 10 minutes after adding domain to Firebase
- [ ] Verified domain is in Firebase Console authorized domains list
- [ ] Checked browser console for specific error messages
- [ ] Tested with different Google account
- [ ] Tested in different browser
- [ ] Backend `/api/health` endpoint responds (test: `curl http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/api/health`)
- [ ] Frontend loads correctly (test: open URL in browser)
- [ ] Email/password sign-in works (test: create account with email)

---

## 📸 What Information to Provide

If still not working, please provide:

1. **Browser Console Screenshot**:
   - Open DevTools (F12)
   - Go to Console tab
   - Click "Sign in with Google"
   - Screenshot any error messages

2. **Network Tab Screenshot**:
   - Open DevTools (F12)
   - Go to Network tab
   - Click "Sign in with Google"
   - Screenshot the failed requests (if any)

3. **Firebase Console Screenshot**:
   - Screenshot of authorized domains list
   - Screenshot of Google sign-in method status

4. **Exact Error Message**:
   - Copy the exact error text from console
   - Include any error codes (e.g., `auth/unauthorized-domain`)

---

## 🎯 Expected Behavior (When Working)

1. User clicks "Sign in with Google" button
2. **Popup opens** with Google sign-in page
3. User selects Google account
4. Google asks for permission (first time only)
5. **Popup closes automatically**
6. User is redirected to home page
7. User data is saved in MongoDB
8. User can access protected routes

---

## 🆘 Still Not Working?

### Quick Workaround
Use email/password authentication while we debug:
1. Go to: http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/signup
2. Fill in details
3. Click "Create Account"
4. This works perfectly!

### Get Help
Provide the information from "What Information to Provide" section above, and I'll help you debug further.

---

## 💡 Common Mistakes

1. **Typo in domain**: Make sure it's exactly `bitedash-alb-443240071.us-east-1.elb.amazonaws.com`
2. **Wrong Firebase project**: Make sure you're in project `vingo-b3fd6`
3. **Browser cache**: Always test in incognito after making changes
4. **Not waiting**: Firebase needs 5-10 minutes to propagate changes
5. **Popup blocker**: Browser might be blocking the Google popup
6. **Wrong Google account**: Try with a personal Gmail account

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Clicking "Sign in with Google" opens Google popup
- ✅ No error in browser console
- ✅ Popup closes after selecting account
- ✅ You're redirected to home page
- ✅ Your name appears in the navigation bar
- ✅ You can access protected routes like /cart

---

## 📞 Additional Resources

- **Firebase Auth Docs**: https://firebase.google.com/docs/auth/web/google-signin
- **Firebase Console**: https://console.firebase.google.com/
- **AWS ECS Console**: https://console.aws.amazon.com/ecs/
- **Application URL**: http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/
