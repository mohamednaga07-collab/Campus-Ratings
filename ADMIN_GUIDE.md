# Admin Dashboard Guide

## Overview
The Admin Dashboard is a comprehensive management interface for ProfRate administrators to manage users, doctors, and reviews.

## Access

### Admin Login Credentials
```
Username: admin
Password: admin123
Email: admin@profrate.com
```

### How to Access
1. Go to http://localhost:5000
2. Login with admin credentials above
3. You'll automatically be redirected to the Admin Dashboard

Alternatively, navigate directly to: http://localhost:5000/admin

## Features

### 📊 Dashboard Overview
- **Total Users**: Count of all registered users
- **Total Doctors**: Count of all doctor profiles
- **Total Reviews**: Count of all submitted reviews
- **Reports**: Pending reports (placeholder for future feature)

### 👥 User Management
**Actions:**
- View all registered users with details (username, email, name, role, join date)
- **Edit Role**: Change user role between Student, Teacher, and Admin
- **Delete User**: Remove users from the system

**How to:**
1. Click "Users" tab
2. Click pencil icon to edit user role
3. Select new role from dropdown
4. Click "Save Changes"
5. Click trash icon to delete user (with confirmation)

### 🎓 Doctor Management
**Actions:**
- **Add New Doctor**: Create doctor profiles with name, department, title, and bio
- **View Doctors**: See all doctor profiles with creation dates
- **Delete Doctor**: Remove doctor profiles (cascades to reviews and ratings)

**How to Add Doctor:**
1. Click "Doctors" tab
2. Fill in the form:
   - Name (required)
   - Department (required)
   - Title (optional)
   - Bio (optional)
3. Click "Add Doctor"

**How to Delete Doctor:**
1. Find doctor in table
2. Click trash icon
3. Confirm deletion

### 📝 Review Management
**Actions:**
- View all reviews with doctor names and ratings
- See individual rating factors (teaching quality, knowledge, etc.)
- Delete inappropriate or spam reviews
- Ratings are automatically recalculated after deletion

**How to:**
1. Click "Reviews" tab
2. Browse all submitted reviews
3. Click trash icon on any review to delete (with confirmation)
4. System automatically updates doctor's average ratings

## Role-Based Access

### Role Hierarchy
1. **Student** (default)
   - Can rate and review doctors
   - Can compare doctors
   - Limited to student features

2. **Teacher**
   - Can see their own profile
   - Can view reviews about themselves
   - Has teacher dashboard

3. **Admin**
   - Full system access
   - Can manage all users, doctors, and reviews
   - Can change user roles
   - Admin dashboard is default homepage

### Admin Route Protection
- `/admin` route requires admin role
- Non-admin users see 404 page
- Admin users automatically see admin dashboard on homepage

## API Endpoints

All admin routes require authentication and admin role:

### Stats
```
GET /api/admin/stats
Returns: { totalUsers, totalDoctors, totalReviews, pendingReports }
```

### Users
```
GET /api/admin/users
Returns: Array of all users (without passwords)

PATCH /api/admin/users/:userId/role
Body: { role: "student" | "teacher" | "admin" }
Returns: Success message

DELETE /api/admin/users/:userId
Returns: Success message
```

### Doctors
```
GET /api/admin/doctors
Returns: Array of all doctors

POST /api/admin/doctors
Body: { name, department, title?, bio? }
Returns: Created doctor

DELETE /api/admin/doctors/:doctorId
Returns: Success message (cascades reviews)
```

### Reviews
```
GET /api/admin/reviews
Returns: Array of reviews with doctor names

DELETE /api/admin/reviews/:reviewId
Returns: Success message (recalculates ratings)
```

## Creating More Admin Users

### Method 1: Via Admin Dashboard
1. Login as admin
2. Go to Users tab
3. Find user you want to promote
4. Click edit (pencil icon)
5. Change role to "Admin"
6. Save changes

### Method 2: Via Script
```bash
node create-admin.mjs
```
This will either:
- Create new admin user with credentials shown
- Update existing user to admin role

### Method 3: Manual Database
```bash
node
```
```javascript
const db = require('better-sqlite3')('dev.db');
db.prepare("UPDATE users SET role = 'admin' WHERE username = ?").run('username_here');
```

## Security Notes

⚠️ **Important:**
- Change default admin password after first login
- Only grant admin role to trusted users
- Admin users have full system access
- All admin actions are logged to console

## Troubleshooting

### Can't Access Admin Dashboard
- Check your user role: Must be "admin"
- Verify login status
- Clear browser cache and reload
- Check console for errors

### Admin Routes Return 403
- User role is not "admin"
- Session expired - re-login
- Check server logs for auth errors

### Changes Not Saving
- Check network tab for API errors
- Verify server is running
- Check database file permissions
- Look for error toasts in UI

## Future Enhancements

Planned features:
- [ ] Report system for flagging inappropriate reviews
- [ ] Bulk user operations
- [ ] Export data to CSV
- [ ] Activity logs and audit trail
- [ ] Email notifications for admin actions
- [ ] Doctor profile editing
- [ ] Review moderation queue
- [ ] Statistics and analytics dashboard
