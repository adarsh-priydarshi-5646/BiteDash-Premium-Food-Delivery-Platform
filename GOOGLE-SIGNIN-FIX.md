# 🔧 Google Sign-In Fix Guide

## ⚠️ Current Issue
Google Sign-in is **NOT working** because Firebase doesn't recognize the AWS Load Balancer domain as an authorized domain.

**Error**: Firebase blocks OAuth redirects from unauthorized domains for security.

---

## ✅ Quick Fix (5 Minutes)

### Step 1: Add ALB Domain to Firebase

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Select Project**: `vingo-b3fd6`
3. **Navigate**: Authentication → Settings → Authorized domains
4. **Click**: "Add domain" button
5. **Enter**: `bitedash-alb-443240071.us-east-1.elb.amazonaws.com`
6. **Save** changes

### Step 2: Test Google Sign-In

1. Open: http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/signin
2. Click: "Sign in with Google" button
3. **Expected**: Redirects to Google OAuth page
4. **Select**: Your Google account
5. **Expected**: Redirects back to app and logs you in

---

## 🚀 Production Solution (Recommended)

For a production-ready deployment, use a **custom domain with HTTPS**:

### Why Custom Domain?
- ✅ **HTTPS/SSL** - Secure encrypted connections
- ✅ **Professional** - Better brand image (e.g., app.bitedash.com)
- ✅ **SEO** - Better search engine ranking
- ✅ **Trust** - Users trust custom domains more
- ✅ **Firebase** - Easier to manage authorized domains

### Setup Steps:

#### 1. Get a Domain
- **Option A**: Buy from AWS Route 53 (~$12/year for .com)
- **Option B**: Use existing domain from GoDaddy, Namecheap, etc.

#### 2. Create SSL Certificate (Free)
```bash
# In AWS Certificate Manager (ACM)
aws acm request-certificate \
  --domain-name bitedash.com \
  --subject-alternative-names www.bitedash.com \
  --validation-method DNS \
  --region us-east-1
```

#### 3. Add HTTPS Listener to ALB
```bash
# Add HTTPS listener (port 443) to existing ALB
aws elbv2 create-listener \
  --load-balancer-arn <YOUR_ALB_ARN> \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=<YOUR_CERT_ARN> \
  --default-actions Type=forward,TargetGroupArn=<YOUR_TARGET_GROUP_ARN>
```

#### 4. Configure DNS in Route 53
```bash
# Create A record pointing to ALB
aws route53 change-resource-record-sets \
  --hosted-zone-id <YOUR_ZONE_ID> \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "bitedash.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "<ALB_HOSTED_ZONE_ID>",
          "DNSName": "bitedash-alb-443240071.us-east-1.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        }
      }
    }]
  }'
```

#### 5. Update Firebase Authorized Domains
- Add: `bitedash.com` and `www.bitedash.com`

#### 6. Update Application Configuration
```bash
# Update frontend .env.production
VITE_API_BASE="https://bitedash.com"

# Update backend CORS in index.js
FRONTEND_URL=https://bitedash.com
```

---

## 🔄 Alternative Workarounds

### Option 1: Use Email/Password Authentication
- ✅ **Already working** - No Firebase domain issues
- Users can sign up with email and password

### Option 2: Create New Firebase Project
If you don't have access to the current Firebase project:

1. Go to: https://console.firebase.google.com/
2. Create new project: "BiteDash"
3. Enable Authentication → Google provider
4. Add ALB domain to authorized domains
5. Update `frontend/src/firebase.js` with new config

### Option 3: Contact Project Owner
- Current Firebase project: `vingo-b3fd6`
- Ask owner to add ALB domain to authorized domains

---

## 📋 Technical Details

### Current Configuration
- **Firebase Project**: vingo-b3fd6
- **Auth Domain**: vingo-b3fd6.firebaseapp.com
- **Backend Endpoint**: `/api/auth/google`
- **Frontend Config**: `frontend/src/firebase.js`
- **ALB URL**: http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com

### How Google OAuth Works
1. User clicks "Sign in with Google"
2. Frontend redirects to Firebase Auth
3. Firebase redirects to Google OAuth
4. User selects Google account
5. Google redirects back to Firebase
6. **Firebase checks if redirect domain is authorized** ⚠️
7. Firebase redirects back to app with token
8. Frontend sends token to backend `/api/auth/google`
9. Backend verifies token and creates user session

### Why It's Failing
- Step 6 fails because `bitedash-alb-443240071.us-east-1.elb.amazonaws.com` is not in Firebase authorized domains
- Firebase only allows redirects to authorized domains for security

---

## ✅ Verification Checklist

After fixing, verify these work:

- [ ] Google Sign-in button appears on /signin page
- [ ] Clicking button redirects to Google OAuth page
- [ ] Can select Google account
- [ ] Redirects back to app after selection
- [ ] User is logged in (check Redux state)
- [ ] User data saved in MongoDB
- [ ] Can access protected routes (/cart, /my-orders, etc.)
- [ ] Socket.IO connection established
- [ ] Real-time features work (order updates)

---

## 🆘 Still Not Working?

### Check Browser Console
```javascript
// Look for these errors:
// 1. "auth/unauthorized-domain"
// 2. CORS errors
// 3. Network errors
```

### Check Backend Logs
```bash
# View ECS task logs
aws logs tail /ecs/bitedash-backend --follow
```

### Test Backend Endpoint
```bash
# Test Google auth endpoint
curl -X POST http://bitedash-alb-443240071.us-east-1.elb.amazonaws.com/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@gmail.com","mobile":"1234567890","role":"user"}'
```

---

## 📞 Need Help?

1. **Firebase Console**: https://console.firebase.google.com/
2. **AWS Console**: https://console.aws.amazon.com/
3. **Documentation**: See `README.md` for full setup guide
