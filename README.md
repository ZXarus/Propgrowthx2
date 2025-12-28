# profile table

| Column     | Type      | Description            |
| ---------- | --------- | ---------------------- |
| id         | UUID      | Auto generated user ID |
| email      | TEXT      | User email (unique)    |
| password   | TEXT      | Hashed password        |
| role       | TEXT      | owner / tenant         |
| created_at | TIMESTAMP | Auto generated         |

# verifyOtp

| Column | Type    | Description |
| ------ | ------- | ----------- |
| email  | TEXT    | User email  |
| otp    | INTEGER | 4-digit OTP |

# backend routes in auth

| Route              | Method | Purpose                    |
| ------------------ | ------ | -------------------------- | ----------------- |
| `/login`           | POST   | User login                 |
| `/register`        | POST   | New user registration      |
| `/forgot-password` | POST   | Send OTP                   |
| `/verify-otp`      | POST   | Verify OTP                 |
| `/update-password` | POST   | Update password            |
| `/me`              | GET    | Get logged-in user profile | // token exchange |

# USER REGISTRATION

Email
Password
Role (owner / tenant)
Frontend sends:
POST /register
{
"email": "user@gmail.com",
"password": "123456",
"role": "owner"
}
Backend (register controller)
Checks if email, password, role are provided
Password is hashed using bcrypt
Data is inserted into profiles table
Password is never stored as plain text

# USER LOGIN

Email
Password
Role
POST /login
{
"email": "user@gmail.com",
"password": "123456"
}
Backend (login controller)
Fetch user from profiles table using email
Compare entered password with hashed password using bcrypt
If valid → generate JWT token
Token contains user ID and role

# FORGOT PASSWORD (SEND OTP)

User clicks Forgot Password
→ enters email
→ clicks Send OTP

POST /forgot-password
{
"email": "user@gmail.com"
}

Backend (forgotPassword controller)
Checks if email exists in profiles
Generates 4-digit OTP
Deletes old OTP (if any)
Inserts new OTP into verifyOtp table

# VERIFY OTP

User enters OTP and clicks Verify OTP
POST /verify-otp
{
"email": "user@gmail.com",
"otp": "1234"
}

Backend (verifyOtp controller)
Checks email and OTP in verifyOtp table
If OTP matches → verified
Deletes OTP after verification

# UPDATE PASSWORD

User enters new password and clicks Update Password
POST /update-password
{
"email": "user@gmail.com",
"password": "newpassword123"
}
Backend (passwordUpdate controller)
Verifies user exists
Hashes new password using bcrypt
Updates password in profiles table
Deletes any remaining OTP
