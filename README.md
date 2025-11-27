# AyurSetu - Phase 1: Authentication Foundation

Complete authentication system with Firebase, React, Node.js, Express, and MongoDB.

## 🎯 Features Implemented

### Frontend
- ✅ Firebase Authentication (Google OAuth + Email/Password)
- ✅ React + Vite + Tailwind CSS + Zustand + React Router
- ✅ Three beautiful auth modals (Login, Signup, Set Password)
- ✅ Black & white theme with smooth Framer Motion animations
- ✅ Protected routes with loading states
- ✅ Persistent auth state with Zustand
- ✅ Automatic user session management

### Backend
- ✅ Node.js + Express + MongoDB + Mongoose
- ✅ Firebase Admin SDK for token verification
- ✅ JWT-based authentication with HttpOnly cookies
- ✅ User model with provider tracking
- ✅ Complete auth flow (signup, login, logout, verify)
- ✅ Password status tracking for Google users
- ✅ CORS and security middleware

## 📁 Project Structure

```
TechFiesta/
├── client/                          # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginModal.jsx       # Email/Google login modal
│   │   │   ├── SignupModal.jsx      # Email/Google signup modal
│   │   │   ├── SetPasswordModal.jsx # Password setup for Google users
│   │   │   └── ProtectedRoute.jsx   # Route protection component
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Public landing page
│   │   │   └── Dashboard.jsx        # Protected dashboard
│   │   ├── store/
│   │   │   ├── useAuthStore.js      # Auth state management
│   │   │   └── useAuthModalStore.js # Modal state management
│   │   ├── config/
│   │   │   ├── firebase.js          # Firebase client config
│   │   │   └── api.js               # Axios instance
│   │   ├── App.jsx                  # Main app component
│   │   └── index.css                # Tailwind styles
│   ├── .env.example                 # Environment template
│   └── package.json
│
└── server/                          # Backend Express app
    ├── src/
    │   ├── config/
    │   │   ├── firebase.js          # Firebase Admin SDK
    │   │   └── database.js          # MongoDB connection
    │   ├── models/
    │   │   └── User.js              # User schema
    │   ├── controllers/
    │   │   └── authController.js    # Auth logic
    │   ├── routes/
    │   │   └── authRoutes.js        # Auth endpoints
    │   ├── middleware/
    │   │   ├── auth.js              # JWT verification
    │   │   └── errorHandler.js      # Error handling
    │   ├── utils/
    │   │   └── jwt.js               # JWT utilities
    │   └── server.js                # Express app
    ├── .env.example                 # Environment template
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Firebase project with Authentication enabled

### 1. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard

#### Enable Authentication Methods
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google**
   - Add your email as a test user
   - Configure OAuth consent screen if needed

#### Get Client Configuration
1. Go to **Project Settings** (gear icon) > **General**
2. Scroll to "Your apps" section
3. Click **Web** icon (</>)
4. Register app and copy the `firebaseConfig` object

#### Get Admin SDK Credentials
1. Go to **Project Settings** > **Service Accounts**
2. Click **"Generate New Private Key"**
3. Download the JSON file (keep it secure!)

### 2. Backend Setup

```bash
cd server

# Copy environment template
cp .env.example .env

# Edit .env and add your credentials:
# - MongoDB URI
# - JWT Secret (generate a random 32+ character string)
# - Firebase Admin credentials from the JSON file you downloaded

# Install dependencies (already done)
npm install

# Start the server
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Copy environment template
cp .env.example .env

# Edit .env and add your Firebase client config
# (from the firebaseConfig object you copied earlier)

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

The client will start on `http://localhost:5173`

### 4. MongoDB Setup

Make sure MongoDB is running:

**Local MongoDB:**
```bash
# Windows (if installed as service)
net start MongoDB

# Or run manually
mongod
```

**MongoDB Atlas (Cloud):**
- Update `MONGODB_URI` in server `.env` with your Atlas connection string

## 🔐 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ayursetu
JWT_SECRET=your_super_secret_key_min_32_characters
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### Client (.env)
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

VITE_API_URL=http://localhost:5000
```

## 🧪 Testing the Auth Flow

### Test Email/Password Signup
1. Open `http://localhost:5173`
2. Click "Get Started" or "Sign In"
3. Switch to "Sign up" tab
4. Fill in name, email, password
5. Submit → Should create account and redirect to dashboard

### Test Email/Password Login
1. Click "Sign In"
2. Enter email and password
3. Submit → Should login and redirect to dashboard

### Test Google Sign-In (First Time)
1. Click "Continue with Google"
2. Select Google account
3. **Set Password Modal** should appear
4. Set a password (or skip)
5. Redirect to dashboard

### Test Google Sign-In (Returning User)
1. Click "Continue with Google"
2. Select same Google account
3. Should directly login to dashboard (no password modal)

### Test Session Persistence
1. Login with any method
2. Refresh the page
3. Should remain logged in
4. Close browser and reopen
5. Should still be logged in (Zustand persistence)

### Test Logout
1. Click "Logout" in dashboard
2. Should redirect to landing page
3. Try accessing `/dashboard` directly
4. Should redirect to landing page

## 📡 API Endpoints

### Public Endpoints
- `POST /api/auth/verify-token` - Verify Firebase ID token and create/login user

### Protected Endpoints (Require JWT Cookie)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/update-password-status` - Update password status after Google user sets password

### Health Check
- `GET /health` - Server health check

## 🎨 UI/UX Features

- **Black & White Theme**: Clean, professional design
- **Smooth Animations**: Framer Motion for all transitions
- **Responsive Design**: Works on mobile, tablet, desktop
- **Loading States**: Proper feedback during async operations
- **Error Handling**: User-friendly error messages
- **Password Visibility Toggle**: Show/hide password
- **Form Validation**: Client-side validation before submission

## 🔒 Security Features

- **HttpOnly Cookies**: JWT stored securely, not accessible via JavaScript
- **CORS Protection**: Only frontend URL allowed
- **Firebase Token Verification**: Backend verifies all Firebase tokens
- **Password Requirements**: Minimum 6 characters
- **Secure Password Storage**: Firebase handles password hashing
- **Environment Variables**: Sensitive data not in code

## 📝 User Model Schema

```javascript
{
  firebaseUid: String,      // Firebase user ID (unique)
  email: String,            // User email (unique)
  name: String,             // Display name
  picture: String,          // Profile picture URL
  provider: String,         // "google" or "email"
  hasPassword: Boolean,     // Whether user has set password
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

## 🐛 Troubleshooting

### "Firebase Admin initialization error"
- Check that your `.env` file has correct Firebase Admin credentials
- Make sure `FIREBASE_PRIVATE_KEY` includes the full key with `\n` characters
- Verify the private key is wrapped in quotes

### "MongoDB Connection Error"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, verify connection string and network access

### "CORS Error"
- Verify `FRONTEND_URL` in server `.env` matches your client URL
- Check that both servers are running

### "Invalid or expired token"
- Clear browser cookies
- Check that JWT_SECRET is set in server `.env`
- Verify Firebase project settings

### Google Sign-In Not Working
- Check Firebase Console > Authentication > Sign-in method
- Verify Google provider is enabled
- Add authorized domains in Firebase Console

## 🎯 Next Steps (Phase 2+)

- [ ] User profile management
- [ ] Lecture/course system
- [ ] Doubts/Q&A system
- [ ] File uploads
- [ ] Email verification
- [ ] Password reset flow
- [ ] Admin panel
- [ ] Analytics dashboard

## 📦 Dependencies

### Frontend
- React 19
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router DOM
- Framer Motion (animations)
- Firebase (client SDK)
- Axios
- React Icons

### Backend
- Express
- Mongoose
- Firebase Admin SDK
- JSON Web Token (JWT)
- Cookie Parser
- CORS
- Bcrypt.js
- Dotenv

## 📄 License

This project is part of the AyurSetu educational platform.

---

**Built with ❤️ for Phase 1 Authentication Foundation**
#   E d u S e n s e  
 