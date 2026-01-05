# Security Testing Checklist

## Before Running Tests

1. Make sure bcrypt is installed:
   ```bash
   npm install bcrypt
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open browser to `http://localhost:5000`

---

## 🔐 Password Strength Testing

### Test Cases

#### Too Short Password
```
Input: "Pass1!"
Expected: 
  ❌ Rejected
  Feedback: "Password must be at least 8 characters"
  Score: < 60
```

#### Missing Uppercase
```
Input: "password123!"
Expected:
  ❌ Rejected
  Feedback: "Add uppercase letters (A-Z)"
  Score: < 60
```

#### Missing Lowercase
```
Input: "PASSWORD123!"
Expected:
  ❌ Rejected
  Feedback: "Add lowercase letters (a-z)"
  Score: < 60
```

#### Missing Number
```
Input: "Password!"
Expected:
  ❌ Rejected
  Feedback: "Add numbers (0-9)"
  Score: < 60
```

#### Missing Special Character
```
Input: "Password123"
Expected:
  ❌ Rejected
  Feedback: "Add special characters (!@#$%^&*)"
  Score: < 60
```

#### Valid Strong Password
```
Input: "MySecure$Pass123"
Expected:
  ✅ Accepted
  Feedback: []
  Score: 80+
```

#### Very Strong Password
```
Input: "Tr0p!cal$unset#2024XYZ"
Expected:
  ✅ Accepted
  Feedback: []
  Score: 95+
```

#### Common Pattern Detected
```
Input: "QwertyPass1!"
Expected:
  ❌ Rejected
  Feedback: "Avoid common patterns or dictionary words"
  Score: Reduced by 30
```

---

## 👤 Username Validation Testing

### Test Cases

#### Too Short
```
Input: "ab"
Expected:
  ❌ Rejected
  Error: "Username must be 3-30 characters..."
```

#### Invalid Characters
```
Input: "user@domain.com"
Expected:
  ❌ Rejected
  Error: "Username must be 3-30 characters..."
  Note: @ is not allowed
```

#### Too Long
```
Input: "a" * 31 (31 characters)
Expected:
  ❌ Rejected
  Error: "Username must be 3-30 characters..."
```

#### Valid Username
```
Input: "john_doe"
Expected:
  ✅ Accepted
  Format: john_doe (lowercase)
```

#### Username with Dots
```
Input: "john.doe.123"
Expected:
  ✅ Accepted
  Format: john.doe.123
```

#### Username with Hyphens
```
Input: "john-doe-user"
Expected:
  ✅ Accepted
  Format: john-doe-user
```

#### Uppercase Username
```
Input: "JOHN_DOE"
Expected:
  ✅ Accepted
  Format: john_doe (converted to lowercase)
```

---

## 🔓 Login Security Testing

### Test Case 1: Non-existent User
```
Steps:
1. Click Login tab
2. Enter username: "nonexistent_user_12345"
3. Enter password: "ValidPass123!"
4. Complete reCAPTCHA
5. Click Login

Expected:
  ❌ Error: "Invalid username or password"
  Note: Same message as wrong password (doesn't reveal if user exists)
```

### Test Case 2: Wrong Password
```
Steps:
1. Create account: username "testuser", password "ValidPass123!"
2. Logout (or open private browsing)
3. Click Login tab
4. Enter username: "testuser"
5. Enter password: "WrongPass123!"
6. Complete reCAPTCHA
7. Click Login

Expected:
  ❌ Error: "Invalid username or password"
  Note: Same message as non-existent user
```

### Test Case 3: Successful Login
```
Steps:
1. Enter valid username and password
2. Complete reCAPTCHA
3. Click Login

Expected:
  ✅ Success: Toast "Welcome back, [Name]"
  ✅ Redirect: To dashboard
  ✅ Session: Set in browser
```

### Test Case 4: Empty Username
```
Steps:
1. Leave username blank
2. Enter password: "ValidPass123!"
3. Click Login

Expected:
  ❌ Error: "Username and password are required"
```

### Test Case 5: Empty Password
```
Steps:
1. Enter username: "testuser"
2. Leave password blank
3. Click Login

Expected:
  ❌ Error: "Username and password are required"
```

---

## 📝 Registration Security Testing

### Test Case 1: Weak Password Rejection
```
Steps:
1. Click Register tab
2. Username: "newuser123"
3. Password: "weak"
4. Confirm: "weak"
5. First Name: "John"
6. Last Name: "Doe"
7. Role: "Student"
8. Click Create Account

Expected:
  ❌ Error: "Password is too weak"
  ❌ Feedback: Shows specific requirements not met
  ❌ Button: Disabled until password is strong
```

### Test Case 2: Password Mismatch
```
Steps:
1. Password: "ValidPass123!"
2. Confirm: "DifferentPass123!"
3. Try to click Create Account

Expected:
  ❌ Red border on confirm field
  ❌ Error message: "Passwords don't match"
  ❌ Button: Disabled
```

### Test Case 3: Successful Registration
```
Steps:
1. Username: "newuser" + timestamp
2. Password: "SecurePass123!"
3. Confirm: "SecurePass123!"
4. First Name: "John"
5. Last Name: "Doe"
6. Role: "Student"
7. Complete reCAPTCHA
8. Click Create Account

Expected:
  ✅ Success: "Account Created!"
  ✅ Toast: "Logged in as John Doe"
  ✅ Redirect: To dashboard
```

### Test Case 4: Duplicate Username
```
Steps:
1. Register with username: "duplicate_user"
2. Try to register again with same username
3. Complete reCAPTCHA
4. Click Create Account

Expected:
  ❌ Error: "Username already exists"
  ❌ Toast: Appears in red
```

### Test Case 5: Missing Required Fields
```
Steps:
1. Leave first name blank
2. Fill everything else
3. Try to click Create Account

Expected:
  ❌ Button: Disabled (visual feedback)
  Note: Check which fields are required
```

---

## 🛡️ Security Headers Testing

### Check Headers (Browser DevTools)

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make any API request
4. Click on the request
5. Go to Response Headers

### Expected Headers

```
✅ X-Content-Type-Options: nosniff
   Prevents MIME-type sniffing

✅ X-Frame-Options: DENY
   Prevents clickjacking attacks

✅ X-XSS-Protection: 1; mode=block
   XSS protection for older browsers

✅ Content-Security-Policy: (should see the policy)
   Restricts script execution

✅ Cache-Control: no-store, no-cache
   For /api/* endpoints

✅ Referrer-Policy: strict-origin-when-cross-origin
   Hides referrer information
```

### How to Verify

1. Right-click on page → "Inspect"
2. Go to "Network" tab
3. Reload page
4. Click on any `/api/*` request
5. Check "Response Headers" section

---

## 🔄 reCAPTCHA Testing

### Test Case 1: With reCAPTCHA
```
Steps:
1. Navigate to login
2. See reCAPTCHA checkbox
3. Click "I'm not a robot"
4. Complete verification (may require multiple tries)
5. See "Verified Human" badge

Expected:
  ✅ reCAPTCHA loads correctly
  ✅ Verification badge appears
  ✅ Can now login without reCAPTCHA
```

### Test Case 2: Session Persistence
```
Steps:
1. Complete reCAPTCHA on Login tab
2. Click Register tab
3. Look for "Verified Human" badge

Expected:
  ✅ Badge appears on Register tab too
  ✅ 30-minute session remembered
```

### Test Case 3: Session Expiry
```
Steps:
1. Complete reCAPTCHA
2. Wait 30+ minutes
3. Try to login
4. Notice reCAPTCHA required again

Expected:
  ✅ Session expired after 30 minutes
  ✅ Must verify again
```

---

## 🔐 Password Hashing Verification

### On Backend (Server Logs)

```
Expected logs:
✅ "🔐 Hashing password with bcrypt for new user: testuser"
✅ "✅ New user created: testuser with role: student"
```

### Database Check (Optional)

```sql
-- Check password is hashed
SELECT id, username, password, role FROM users WHERE username = 'testuser';

Expected password format:
$2b$12$... (60 characters starting with $2b$12$)
NOT: plaintext password
```

---

## 📊 Logging & Monitoring Testing

### Check Server Logs

Look for these entries:

```
✅ "🔐 Login attempt for username: testuser"
✅ "👤 Found user: yes ✓"
✅ "🔑 Password valid: yes ✓"
✅ "✅ Session created for user: testuser"

For failed attempts:
✅ "❌ Invalid password attempt for user: testuser from IP: 127.0.0.1"
✅ "⚠️  Suspicious activity detected from IP: 192.168.1.1"
```

---

## 🚨 Attack Simulation (Safe Testing)

### Brute Force Detection
```
Steps:
1. Attempt login 5+ times with wrong password
2. Note: Currently no blocking (rate limiting recommended)
3. Check server logs for all attempts

Expected:
  ✅ Each attempt logged
  ✅ Same error message (doesn't reveal status)
  ⚠️  Rate limiting would help (future enhancement)
```

### SQL Injection Prevention
```
Test Input: username' OR '1'='1
Expected:
  ❌ Treated as literal username
  ❌ Sanitized: username' or '1'='1 (special chars removed)
  ❌ No SQL injection possible
```

### XSS Prevention
```
Test Input: <script>alert('xss')</script>
Username: <img src=x onerror=alert('xss')>
Expected:
  ❌ Treated as literal username
  ❌ Displayed as plain text (not executed)
  ❌ CSP header blocks any inline scripts
```

---

## ✅ Final Verification Checklist

Before declaring security implementation complete:

- [ ] Password strength validation working
- [ ] Passwords hashed with bcrypt in database
- [ ] Username validation working
- [ ] Error messages don't reveal user existence
- [ ] reCAPTCHA working (or disabled in dev)
- [ ] Security headers present
- [ ] Login attempts logged
- [ ] No passwords in logs
- [ ] No plain text passwords in database
- [ ] HTTPS enabled (production)
- [ ] Session management working
- [ ] Logout clears session
- [ ] No credentials in browser console
- [ ] CSP headers loaded
- [ ] All tests passing

---

## 🐛 Known Limitations & TODOs

- ⚠️  No rate limiting (attackers could brute force, but will need bcrypt slowing)
- ⚠️  No account lockout after failed attempts
- ⚠️  No email verification on registration
- ⚠️  No password reset via email
- ⚠️  No 2FA (two-factor authentication)
- ⚠️  No CSRF token validation (session-based is okay for now)

## 🔗 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Bcrypt Password Hashing](https://www.npmjs.com/package/bcrypt)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Glossary/CORS)

---

**Created**: January 4, 2026  
**Status**: Ready for Testing  
**Last Review**: January 4, 2026
