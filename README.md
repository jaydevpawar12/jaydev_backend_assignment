API Gateway Implementation and Management Assignment

This project is a backend server built with Node.js, Express, and MongoDB for handling user authentication, authorization, and basic CRUD operations. It uses Redis for caching, JWT for authentication, and various security and performance-enhancing middlewares.

Setup Instructions
Prerequisites
Node.js (v14 or later)
MongoDB (local or cloud instance)
Redis (local or cloud instance)
Email provider (for sending OTPs via nodemailer)

1. Clone the Repository
First, clone the repository to your local machine:
git clone <your-repository-url>
cd <your-project-folder>

2. Install Dependencies
Install all the required dependencies using npm:npm install

3. Set Up Environment Variables
Create a .env file in the root directory of your project with the following variables:
MONGO_URL=mongodb+srv://<your-db-username>:<your-db-password>@cluster0.mongodb.net/your-database-name
PORT=5000
JWT_KEY=your-secret-jwt-key
FROM_EMAIL=your-email@gmail.com
EMAIL_PASS=your-email-password
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
Note:-Make sure to replace the placeholders with your actual values.

4. Start the Server
To run the server in development mode with nodemon (which automatically restarts the server on code changes):npm run dev
This will start the server on http://localhost:5000 (or the port you specified in the .env file).

Explanation of Implemented Features

1. User Authentication
Register User: Allows users to create an account by providing basic information (name, email, mobile, password). The password is hashed before storing.
Login: Authenticated users can log in using either their email or mobile number. JWT is generated and stored in cookies for session management.
Logout: Clears the authentication cookie to log the user out.
Forgot Password: Sends an OTP (One-Time Password) to the user's email for password recovery.
Reset Password: Allows users to reset their password by providing the OTP sent to their email.

2. Admin Features
Register Admin: Allows the creation of new admin users. This route is only accessible by authenticated admins.
Access Protected Routes: Admin routes are protected with middleware ensuring only admins can access them.

3. Rate Limiting
Login Rate Limiting: Uses express-rate-limit to limit the number of login attempts in a given timeframe to prevent brute-force attacks.

4. Redis Caching
The server uses Redis for caching user data. The cache helps to reduce database load and improves response time for frequently requested data, like the list of users.

5. Security Enhancements
Helmet: Adds various HTTP headers to improve security.
MongoDB Sanitization: Prevents NoSQL injection by sanitizing incoming data.
CORS: Cross-Origin Resource Sharing is configured to allow or restrict the origins making requests to the server.

6. Email Service
Uses nodemailer to send OTPs for the password reset process.


How to Test the API Endpoints
You can test the API endpoints using tools like Postman or Insomnia. Below are the details for the available endpoints:

1. POST /api/auth/register - Register a new user

Body (JSON)

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "StrongPassword123"
}

Response:

{
  "status": 200,
  "message": "User register Successfully"
}


2. POST /api/auth/register-admin - Register a new admin (admin only)

Body (JSON)

{
  "name": "Admin User",
  "email": "admin@example.com",
  "mobile": "0987654321",
  "password": "AdminPassword123",
  "role": "admin"
}

3. POST /api/auth/login - Login

Body (JSON):

{
  "username": "john@example.com",  // or "1234567890"
  "password": "StrongPassword123"
}

Response:{
  "status": 200,
  "message": "User login successfully",
  "result": {
    "userId": "user-id",
    "mobile": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "JWT-Token"
  }
}

4. POST /api/auth/forgotPass - Request OTP for password reset

Body (JSON):

{
  "email": "john@example.com"
}

5. POST /api/auth/resetPass - Reset password using OTP

Body (JSON):

{
  "email": "john@example.com",
  "otp": "1234",  // OTP received via email
  "newPassword": "NewStrongPassword123"
}

6. POST /api/auth/logout - Logout the user

Response:

{
  "status": 200,
  "message": "User logout successfully"
}

7. GET /api/admin/users - Get all users (admin only)

Headers:Authorization= Bearer JWT token (from login response)

Response:
{
  "message": "Fetch Success",
  "result": [
    {
      "userId": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "1234567890"
    },
    {
      "userId": "user-id",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "mobile": "9876543210"
    }
  ]
}

Additional Notes:
Ensure Redis and MongoDB are running before starting the server.
You can modify the caching time or expiration values based on your use case.
If you're using an email provider (like Gmail), make sure to enable less secure apps or use an app password to send emails.







