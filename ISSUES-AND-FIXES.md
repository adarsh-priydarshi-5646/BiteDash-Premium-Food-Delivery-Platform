# Application Issues and Fixes

## Issues Identified from Browser Console

### 1. Vercel Analytics 404 Error (FIXED)

**Error:**
```
GET http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/_vercel/insights/script.js 
net::ERR_ABORTED 404 (Not Found)
```

**Cause:** Application was trying to load Vercel analytics script, but we're deployed on AWS ECS, not Vercel.

**Fix Applied:**
- Removed `@vercel/analytics` import from `frontend/src/main.jsx`
- Removed `@vercel/analytics` dependency from `frontend/package.json`
- Pushed changes to trigger new deployment

**Status:** FIXED - Will be resolved after CI/CD deployment completes (5-10 minutes)

---

### 2. Firebase Invalid API Key Error

**Error:**
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

**Cause:** The Firebase API key in the environment variable might be incorrect or the Firebase project settings need verification.

**Current Configuration:**
```
VITE_FIREBASE_APIKEY="AIzaSyCiUyRYcPsxy2dpUogBifjfoh3duzTLtso"
```

**Possible Solutions:**

**Option A: Verify Firebase Project Settings**
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: `vingo-b3fd6`
3. Go to Project Settings (gear icon)
4. Check if the API key matches: `AIzaSyCiUyRYcPsxy2dpUogBifjfoh3duzTLtso`
5. If different, update `frontend/.env.production` with correct key
6. Rebuild and redeploy

**Option B: Create New Firebase Project (Recommended)**
Since you're having issues with the existing Firebase project, create a new one:

1. Go to Firebase Console
2. Create new project: "BiteDash"
3. Enable Google Authentication
4. Add authorized domains:
   - `localhost`
   - `bitedash-alb-443240071.us-east-1.elb.amazonaws.com`
5. Get new Firebase config
6. Update `frontend/src/firebase.js` and `frontend/.env.production`
7. Rebuild and redeploy

**Status:** NEEDS ACTION - Requires Firebase project verification or recreation

---

### 3. WebSocket Connection Failures

**Error:**
```
WebSocket connection to 'ws://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/socket.io/?EIO=4&transport=websocket' failed
```

**Cause:** AWS Application Load Balancer needs specific configuration to support WebSocket connections for Socket.IO.

**Required ALB Configuration:**

The ALB target group needs these settings:
- **Stickiness:** Enabled (required for Socket.IO)
- **Stickiness Type:** Load balancer generated cookie
- **Stickiness Duration:** 86400 seconds (24 hours)

**Fix via AWS CLI:**

```bash
# Get target group ARN
aws elbv2 describe-target-groups \
  --names bitedash-backend-tg \
  --region us-east-1 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text

# Enable stickiness
aws elbv2 modify-target-group-attributes \
  --target-group-arn <TARGET_GROUP_ARN> \
  --attributes \
    Key=stickiness.enabled,Value=true \
    Key=stickiness.type,Value=lb_cookie \
    Key=stickiness.lb_cookie.duration_seconds,Value=86400 \
  --region us-east-1
```

**Fix via AWS Console:**

1. Go to EC2 Console → Target Groups
2. Select `bitedash-backend-tg`
3. Go to "Attributes" tab
4. Click "Edit"
5. Enable "Stickiness"
6. Set duration to 86400 seconds
7. Save changes

**Status:** NEEDS ACTION - Requires AWS configuration change

---

### 4. 401 Unauthorized on /api/user/current

**Error:**
```
GET http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/api/user/current 401 (Unauthorized)
```

**Cause:** This is expected behavior when user is not logged in. The application tries to check if there's an authenticated user on page load.

**Explanation:** 
- This endpoint requires JWT token in httpOnly cookie
- If no cookie exists (user not logged in), returns 401
- This is normal and handled by the application
- After successful login, this endpoint will return user data

**Status:** NOT AN ISSUE - Expected behavior for unauthenticated users

---

## Summary of Actions Required

### Immediate (Do Now)

1. **Wait for Deployment** (5-10 minutes)
   - GitHub Actions is deploying the fix for Vercel analytics
   - Check: https://github.com/adarsh-priydarshi-5646/BiteDash-Premium-Food-Delivery-Platform/actions
   - Once complete, the 404 error will be gone

2. **Fix WebSocket/Socket.IO** (5 minutes)
   - Enable stickiness on ALB target group (see commands above)
   - This will fix real-time features (order tracking, notifications)

3. **Fix Firebase** (Choose one):
   - **Option A:** Verify existing Firebase project settings
   - **Option B:** Create new Firebase project (recommended)

### Testing After Fixes

1. **Clear browser cache:**
   ```
   Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   Select "All time"
   Clear cookies and cached files
   ```

2. **Test in incognito window:**
   - Open: http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/
   - Try email/password sign up (should work)
   - Check browser console for errors

3. **Verify Socket.IO connection:**
   - After enabling stickiness, check console
   - Should see: "Socket connected: <socket-id>"
   - No more WebSocket connection errors

---

## Expected Behavior After All Fixes

### Browser Console (Clean)
- No 404 errors
- No Firebase errors (if fixed)
- Socket.IO connected successfully
- Only 401 on /api/user/current (normal when not logged in)

### Application Features
- Email/password authentication works
- Google Sign-in works (after Firebase fix)
- Real-time order tracking works (after WebSocket fix)
- Order notifications work (after WebSocket fix)
- All other features work normally

---

## Commands Reference

### Check Deployment Status
```bash
# Check GitHub Actions
# Go to: https://github.com/adarsh-priydarshi-5646/BiteDash-Premium-Food-Delivery-Platform/actions

# Check ECS service status
aws ecs describe-services \
  --cluster bitedash-cluster \
  --services bitedash-frontend-service \
  --region us-east-1 \
  --query 'services[0].deployments'
```

### Check Backend Logs
```bash
# View backend logs
aws logs tail /ecs/bitedash-backend --follow --region us-east-1

# View frontend logs
aws logs tail /ecs/bitedash-frontend --follow --region us-east-1
```

### Test Backend API
```bash
# Test health endpoint
curl http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/api/health

# Test Socket.IO endpoint
curl http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/socket.io/
```

### Force New Deployment
```bash
# Force redeploy frontend
aws ecs update-service \
  --cluster bitedash-cluster \
  --service bitedash-frontend-service \
  --force-new-deployment \
  --region us-east-1

# Force redeploy backend
aws ecs update-service \
  --cluster bitedash-cluster \
  --service bitedash-backend-service \
  --force-new-deployment \
  --region us-east-1
```

---

## Timeline

**Now:**
- Vercel analytics fix deployed via CI/CD (wait 5-10 minutes)

**Next 10 minutes:**
- Enable ALB stickiness for WebSocket support
- Verify/fix Firebase configuration

**After fixes:**
- Clear browser cache
- Test all features
- Verify no console errors

---

## Need Help?

If issues persist after applying these fixes:

1. **Share browser console screenshot** (after clearing cache)
2. **Share AWS CLI output** from stickiness configuration
3. **Share Firebase project settings** screenshot
4. **Test with email/password** (should work regardless of Firebase)

The application is deployed and running. These are configuration issues that can be fixed without redeploying the application code.
