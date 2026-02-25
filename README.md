# DevTinder - Developer Matching Platform

> A Tinder-style app for developers — swipe, connect, and collaborate! Built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Architecture & Flow Diagram](#architecture--flow-diagram)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Frontend Flow](#frontend-flow)
- [State Management (Redux)](#state-management-redux)
- [Routing & Protected Routes](#routing--protected-routes)
- [Connection Request Flow](#connection-request-flow)
- [Feed Logic](#feed-logic)
- [Cookie & CORS Setup](#cookie--cors-setup)
- [How to Run](#how-to-run)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Project Overview

DevTinder is a full-stack MERN application where developers can:

1. **Sign Up / Login** — Create an account with secure password hashing (bcrypt) + JWT authentication
2. **View Feed** — Browse other developer profiles (Tinder-style, one card at a time)
3. **Send Requests** — Click "Interested" or "Ignored" to send a connection request
4. **Review Requests** — Accept or reject received connection requests
5. **View Connections** — See a list of all accepted connections
6. **Edit Profile** — Update your profile (name, photo, age, gender, about)
7. **Change Password** — Verify old password and set a new one
8. **Logout** — Clear the auth cookie and end the session

---

## Tech Stack

### Backend (Server)

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| **Node.js**       | Runtime environment            |
| **Express.js**    | Web framework                  |
| **MongoDB**       | Database (NoSQL)               |
| **Mongoose**      | MongoDB ODM (Object Modelling) |
| **bcrypt**        | Password hashing               |
| **JWT**           | Authentication tokens          |
| **cookie-parser** | Cookie handling                |
| **cors**          | Cross-Origin Resource Sharing  |
| **validator**     | Email/password validation      |
| **dotenv**        | Environment variables          |

### Frontend (Client)

| Technology          | Purpose                    |
| ------------------- | -------------------------- |
| **React 19**        | UI library                 |
| **Vite**            | Build tool & dev server    |
| **React Router v7** | Client-side routing        |
| **Redux Toolkit**   | Global state management    |
| **Axios**           | HTTP client                |
| **TailwindCSS v4**  | Utility-first CSS          |
| **DaisyUI v5**      | Tailwind component library |

---

## Folder Structure

```
DevTinder/
├── package.json                 # Root package.json (runs both client & server via concurrently)
├── .env                         # Root environment variables
│
├── server/                      # ========== BACKEND ==========
│   ├── package.json
│   ├── .env                     # Server env (MONGODB_URI, JWT_SECRET, etc.)
│   └── src/
│       ├── app.js               # Entry point — Express app setup, middleware, routes, server start
│       ├── config/
│       │   └── database.js      # MongoDB connection (mongoose.connect)
│       ├── middlewares/
│       │   └── auth.js          # userAuth middleware — verifies JWT token from cookie
│       ├── models/
│       │   ├── User.js          # User schema + getJWT() + validatePassword() instance methods
│       │   └── ConnectionRequest.js  # Connection request schema (fromUserId, toUserId, status)
│       ├── routes/
│       │   ├── authRouter.js    # POST /signup, /login, /logout
│       │   ├── profileRouter.js # GET /profile/view, PATCH /profile/edit, /profile/edit/password
│       │   ├── requestRouter.js # POST /request/send/:status/:toUserId, /request/review/:status/:requestId
│       │   └── userRouter.js    # GET /user/requests/received, /user/view/connections, /user/feed, /user/view/sending/request
│       └── utils/
│           └── validation.js    # validateSignUpData, validateEditProfileData, validateOldPassword, validateNewPasswordData
│
├── client/                      # ========== FRONTEND ==========
│   ├── package.json
│   ├── .env                     # Client env (VITE_API_BASE_URL)
│   ├── vite.config.js           # Vite config (port 5173)
│   ├── index.html               # HTML entry point
│   └── src/
│       ├── main.jsx             # React entry point (createRoot)
│       ├── App.jsx              # BrowserRouter + Routes + Redux Provider
│       ├── Body.jsx             # Legacy layout component (replaced by Layout.jsx)
│       ├── index.css            # Global CSS (Tailwind import)
│       ├── config/
│       │   └── baseurl.js       # BASE_URL = "http://localhost:3030/api"
│       ├── utils/
│       │   ├── appStore.jsx     # Redux store configuration (user, feed, connection slices)
│       │   ├── userSlice.jsx    # Actions: addUser, removeUser
│       │   ├── feedSlice.jsx    # Actions: addUserToFeed, removeUserFromFeed, clearFeed
│       │   └── connectionSlice.jsx  # Actions: addConnection, removeConnection
│       ├── components/
│       │   ├── Layout.jsx       # Main layout wrapper (Navbar + Outlet + Footer)
│       │   ├── ProtectedRoute.jsx   # Auth guard — redirects to /login if not authenticated
│       │   ├── Navbar.jsx       # Top navigation bar with user avatar, dropdown menu, logout
│       │   ├── Footer.jsx       # Footer with social media icons
│       │   ├── UserCard.jsx     # Developer card (photo, name, about) + Interested/Ignored buttons
│       │   ├── ConnectionCard.jsx       # Card displaying an accepted connection
│       │   ├── ConnectionRequestCard.jsx # Pending request card with Accept/Reject buttons
│       │   ├── EditProfile.jsx  # Placeholder component (not in use yet)
│       │   └── Toast.jsx        # Success toast notification component
│       └── pages/
│           ├── Login.jsx        # Login + Signup page (toggleable mode)
│           ├── Feed.jsx         # Home page — shows developer cards one by one
│           ├── Profile.jsx      # Edit profile form + live UserCard preview
│           ├── Connection.jsx   # Displays list of accepted connections
│           └── ReviewRequest.jsx # Displays list of received connection requests
```

---

## Architecture & Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                        │
│                        Port: 5173                                   │
│                                                                     │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────────────────────┐ │
│  │  Login    │──▶│  Redux Store │──▶│  Protected Pages            │ │
│  │  Page     │   │  (user,feed, │   │  (Feed, Profile, Connection,│ │
│  │          │   │  connection)  │   │   ReviewRequest)            │ │
│  └──────────┘   └──────┬───────┘   └─────────────────────────────┘ │
│                         │                                           │
│              Axios + withCredentials: true                          │
│                         │                                           │
└─────────────────────────┼───────────────────────────────────────────┘
                          │ HTTP (Cookie-based Auth)
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SERVER (Express.js)                           │
│                       Port: 3030                                    │
│                                                                     │
│  ┌────────────┐   ┌──────────────┐   ┌──────────────────────────┐  │
│  │ Middleware  │──▶│   Routes     │──▶│  MongoDB (Atlas)         │  │
│  │ (CORS,     │   │ (auth,       │   │  ┌────────────────────┐  │  │
│  │  JSON,     │   │  profile,    │   │  │ Users Collection   │  │  │
│  │  Cookie,   │   │  request,    │   │  │ ConnectionRequests │  │  │
│  │  Auth)     │   │  user)       │   │  └────────────────────┘  │  │
│  └────────────┘   └──────────────┘   └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Models

### 1. User Model (`server/src/models/User.js`)

```
User {
  firstName    : String (required, minLength: 3)
  lastName     : String
  emailId      : String (required, unique, lowercase, validated)
  password     : String (required, strong password validated)
  age          : Number (min: 18)
  gender       : String (enum: "Male", "Female", "Other")
  photoUrl     : String (default: placeholder image URL)
  about        : String (default: "This is a default about of the user!")
  skills       : [String]
  timestamps   : true (createdAt and updatedAt are auto-generated)
}

Instance Methods:
  - getJWT()                → Generates a JWT token with 7-day expiry
  - validatePassword(pass)  → Compares input password with stored hash using bcrypt
```

### 2. ConnectionRequest Model (`server/src/models/ConnectionRequest.js`)

```
ConnectionRequest {
  fromUserId  : ObjectId (ref: "User") — the user who sent the request
  toUserId    : ObjectId (ref: "User") — the user who receives the request
  status      : String (enum: "ignored", "interested", "accepted", "rejected")
  timestamps  : true
}

Compound Index: { fromUserId: 1, toUserId: 1 }  — for fast lookups
Pre-save Hook: Prevents a user from sending a request to themselves (fromUserId === toUserId)
```

### Status Flow:

```
          User A swipes right
User A ──────────────────────▶ ConnectionRequest (status: "interested")
          User A swipes left
User A ──────────────────────▶ ConnectionRequest (status: "ignored")

          User B accepts
"interested" ─────────────────▶ "accepted"  ✅ (Both users are now connected)
          User B rejects
"interested" ─────────────────▶ "rejected"  ❌
```

---

## API Endpoints

All routes are prefixed with `/api` (e.g., `http://localhost:3030/api/login`)

### Auth Routes (`authRouter.js`)

| Method | Endpoint      | Auth? | Description                                        |
| ------ | ------------- | ----- | -------------------------------------------------- |
| POST   | `/api/signup` | No    | Register new user + hash password + set JWT cookie |
| POST   | `/api/login`  | No    | Verify email/password + set JWT cookie             |
| POST   | `/api/logout` | Yes   | Clear auth cookie (maxAge: 0)                      |

### Profile Routes (`profileRouter.js`)

| Method | Endpoint                     | Auth? | Description                              |
| ------ | ---------------------------- | ----- | ---------------------------------------- |
| GET    | `/api/profile/view`          | Yes   | Returns the logged-in user's profile     |
| PATCH  | `/api/profile/edit`          | Yes   | Updates allowed profile fields           |
| PATCH  | `/api/profile/edit/password` | Yes   | Verifies old password and sets a new one |

### Request Routes (`requestRouter.js`)

| Method | Endpoint                                 | Auth? | Description                                             |
| ------ | ---------------------------------------- | ----- | ------------------------------------------------------- |
| POST   | `/api/request/send/:status/:toUserId`    | Yes   | Sends a connection request (status: interested/ignored) |
| POST   | `/api/request/review/:status/:requestId` | Yes   | Reviews a request (status: accepted/rejected)           |

### User Routes (`userRouter.js`)

| Method | Endpoint                         | Auth? | Description                                                     |
| ------ | -------------------------------- | ----- | --------------------------------------------------------------- |
| GET    | `/api/user/requests/received`    | Yes   | Gets all pending incoming requests (status: interested)         |
| GET    | `/api/user/view/sending/request` | Yes   | Gets all pending outgoing requests                              |
| GET    | `/api/user/view/connections`     | Yes   | Gets all accepted connections (both directions)                 |
| GET    | `/api/user/feed`                 | Yes   | Gets users with no existing connection relationship (paginated) |

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    SIGNUP / LOGIN FLOW                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User fills in the Login/Signup form                      │
│                    │                                         │
│                    ▼                                         │
│  2. Axios POST → /api/login or /api/signup                  │
│     (withCredentials: true — required for cookie exchange)   │
│                    │                                         │
│                    ▼                                         │
│  3. Server-side processing:                                  │
│     - Login:  Find User by email → bcrypt.compare password  │
│     - Signup: Validate → bcrypt.hash password → Save User   │
│                    │                                         │
│                    ▼                                         │
│  4. Generate JWT token (signs user._id, expires in 7 days)  │
│                    │                                         │
│                    ▼                                         │
│  5. res.cookie("token", token, {                            │
│        httpOnly: true,     ← Not accessible via JavaScript  │
│        secure: production, ← true only on HTTPS             │
│        sameSite: "lax",    ← CSRF protection                │
│        maxAge: 7 days,                                       │
│        path: "/"                                             │
│     })                                                       │
│                    │                                         │
│                    ▼                                         │
│  6. Response contains user data                              │
│     → dispatch(addUser(userData)) to Redux store            │
│     → Navigate to /feed (login) or /profile (signup)        │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   PROTECTED ROUTE CHECK                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User opens a protected page (e.g., /feed, /profile)     │
│                    │                                         │
│                    ▼                                         │
│  2. ProtectedRoute.jsx checks authentication:               │
│     - Is user already in Redux? → If yes, render the page  │
│     - If not → API call: GET /api/profile/view              │
│                    │                                         │
│                    ▼                                         │
│  3. Server-side userAuth middleware:                         │
│     - Extracts "token" from cookie                          │
│     - jwt.verify(token, JWT_SECRET)                         │
│     - User.findById(decoded._id)                            │
│     - Attaches user to req.user for downstream routes       │
│                    │                                         │
│                    ▼                                         │
│  4. Token valid → User data returned → Stored in Redux      │
│     Token invalid/expired → 401 → Redirect to /login        │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      LOGOUT FLOW                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User clicks Logout in the Navbar                        │
│                    │                                         │
│                    ▼                                         │
│  2. POST /api/logout (clears cookie with maxAge = 0)        │
│                    │                                         │
│                    ▼                                         │
│  3. Clear the Redux store:                                  │
│     - dispatch(removeUser())                                │
│     - dispatch(clearFeed())                                 │
│     - dispatch(removeConnection())                          │
│                    │                                         │
│                    ▼                                         │
│  4. navigate("/login")                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Frontend Flow

### Page-by-Page Flow:

### 1. Login Page (`pages/Login.jsx`)

```
- Both Login and Signup share the same page (toggled via isNewUser state)
- Login:  POST /api/login  → { emailId, password }
- Signup: POST /api/signup → { firstName, lastName, emailId, password }
- On success → dispatch(addUser()) → navigate to / or /profile
- Form validation: email regex, password length, required fields
- If already logged in → auto-redirect to /
```

### 2. Feed Page (`pages/Feed.jsx`)

```
- Home page — fetches GET /api/user/feed?page=1&limit=10
- Displays one UserCard at a time (feed[0])
- "Interested" button → POST /api/request/send/interested/:userId
- "Ignored" button   → POST /api/request/send/ignored/:userId
- After clicking → removeUserFromFeed(userId) → shows the next card
- If feed is empty → displays "No new users" message
```

### 3. Profile Page (`pages/Profile.jsx`)

```
- Left side:  Edit form (firstName, lastName, photoUrl, age, gender, about)
- Right side: Live preview using UserCard component (action buttons hidden)
- On save → PATCH /api/profile/edit → dispatch(addUser(updatedData))
- On success → Toast notification appears for 4 seconds
```

### 4. Connection Page (`pages/Connection.jsx`)

```
- Fetches GET /api/user/view/connections
- Renders ConnectionCard components in a responsive grid
- Each card displays: avatar, name, age, gender, about, and a Message button
```

### 5. Review Request Page (`pages/ReviewRequest.jsx`)

```
- Fetches GET /api/user/requests/received (status: "interested")
- Renders a list of ConnectionRequestCard components
- "Accept" → POST /api/request/review/accepted/:requestId
- "Reject" → POST /api/request/review/rejected/:requestId
- After Accept/Reject, the card is removed from the list
```

---

## State Management (Redux)

```
Redux Store (appStore.jsx)
├── user (userSlice.jsx)
│   ├── state: null | UserObject
│   ├── addUser(payload)    → Set on login, signup, or profile fetch
│   └── removeUser()        → Reset to null on logout
│
├── feed (feedSlice.jsx)
│   ├── state: null | [UserObject, ...]
│   ├── addUserToFeed(payload)       → Stores the feed API response
│   ├── removeUserFromFeed(userId)   → Removes a user after swiping
│   └── clearFeed()                  → Reset to null on logout
│
└── connection (connectionSlice.jsx)
    ├── state: null | [UserObject, ...]
    ├── addConnection(payload)   → Stores the connections API response
    └── removeConnection()       → Reset to null on logout
```

---

## Routing & Protected Routes

```jsx
<Provider store={appStore}>
  <BrowserRouter>
    <Routes>
      {/* Public — accessible by anyone */}
      <Route path="/login" element={<Login />} />

      {/* Protected — only for authenticated users */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Feed />} /> {/* / */}
        <Route path="feed" element={<Feed />} /> {/* /feed */}
        <Route path="profile" element={<Profile />} />
        <Route path="connection" element={<Connection />} />
        <Route path="request" element={<ReviewRequest />} />
      </Route>

      {/* Catch-all → redirect to / */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
</Provider>
```

**ProtectedRoute Logic:**

```
1. Is user already in Redux store? → Yes: render children
2. No? → Call GET /api/profile/view (verifies cookie on server)
   - Success → addUser() → render children
   - 401 Error → redirect to /login
3. Show a loading spinner while verification is in progress
```

**Layout Component:**

```
Layout = Navbar + <Outlet /> (child routes render here) + Footer
```

---

## Connection Request Flow

```
              ┌──────────┐                    ┌──────────┐
              │  User A   │                    │  User B   │
              └─────┬─────┘                    └─────┬─────┘
                    │                                │
                    │  User B's card appears in       │
                    │  User A's feed (UserCard)       │
                    │                                │
          ┌────────┴────────┐                        │
          │                  │                        │
    Click "Interested"  Click "Ignored"               │
          │                  │                        │
          ▼                  ▼                        │
   POST /request/send/  POST /request/send/           │
   interested/:B_id     ignored/:B_id                 │
          │                  │                        │
          ▼                  ▼                        │
   ConnectionRequest    ConnectionRequest             │
   {                    {                             │
     from: A,             from: A,                    │
     to: B,               to: B,                      │
     status: interested   status: ignored             │
   }                    }                             │
          │                  │                        │
          │                  └── (done, B is ignored)  │
          │                                           │
          │  Appears on User B's "Review Requests"    │
          │  page (GET /user/requests/received)        │
          │                                           │
          └──────────────────────────────────────────▶│
                                                      │
                                            ┌─────────┴─────────┐
                                            │                    │
                                      Click "Accept"      Click "Reject"
                                            │                    │
                                            ▼                    ▼
                                     POST /request/review/ POST /request/review/
                                     accepted/:reqId       rejected/:reqId
                                            │                    │
                                            ▼                    ▼
                                     status → "accepted"  status → "rejected"
                                            │                    │
                                            ▼                    │
                                     Both are now connected!     │
                                     Visible in                  │
                                     GET /user/view/connections  │
```

---

## Feed Logic

Server-side logic (`userRouter.js` → `GET /api/user/feed`):

```
1. Find all ConnectionRequests for the logged-in user (both sent and received)
2. Collect all related user IDs into a Set (hideUserFromFeed)
3. Query User.find() for users who:
   - Are NOT in the hideUserFromFeed set
   - Are NOT the logged-in user themselves
4. Apply pagination: skip = (page - 1) * limit, max limit = 50
5. Return the result to the client
```

**The following users will NOT appear in the feed:**

- The logged-in user themselves
- Users they sent an "interested" request to
- Users they "ignored"
- Users with an "accepted" connection
- Users with a "rejected" connection

---

## Cookie & CORS Setup

### CORS (`server/src/app.js`):

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite dev server
  credentials: true, // Required to allow cookies in cross-origin requests
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
```

### Cookie Options (used in every auth route):

```javascript
const cookieOptions = {
  httpOnly: true, // Not accessible via JavaScript (XSS protection)
  secure: false, // false in development (HTTP), true in production (HTTPS)
  sameSite: "lax", // "lax" in development, "none" in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/", // Cookie is available on all routes
};
```

### Client Side (Axios):

```javascript
// withCredentials: true is REQUIRED on every API call to send/receive cookies
axios.get(BASE_URL + "/profile/view", { withCredentials: true });
```

---

## How to Run

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account (or a local MongoDB instance)

### 1. Clone & Install

```bash
git clone <repo-url>
cd DevTinder

# Install all dependencies (root + client)
npm run install-all
```

### 2. Environment Variables Setup

**Server** (`server/.env`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/DevTinderDB
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
PORT=3030
```

**Client** (`client/.env`):

```env
VITE_API_BASE_URL=http://localhost:3030/api
VITE_APP_NAME=DevTinder
```

### 3. Run Development

```bash
# Start both client and server simultaneously (from root)
npm run dev

# Or run them separately:
npm run server    # Backend → http://localhost:3030
npm run client    # Frontend → http://localhost:5173
```

### 4. Health Check

```
GET http://localhost:3030/check  → Verify the API is running
GET http://localhost:3030/health → Check server health + uptime
```

---

## Environment Variables

### Server (`server/.env`)

| Variable       | Description                        | Example                      |
| -------------- | ---------------------------------- | ---------------------------- |
| `MONGODB_URI`  | MongoDB Atlas connection string    | `mongodb+srv://...`          |
| `JWT_SECRET`   | Secret key for JWT signing         | `MySecretKey123!`            |
| `FRONTEND_URL` | Frontend URL (CORS allowed origin) | `http://localhost:5173`      |
| `PORT`         | Server port                        | `3030`                       |
| `NODE_ENV`     | Environment mode                   | `development` / `production` |

### Client (`client/.env`)

| Variable            | Description      | Example                     |
| ------------------- | ---------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API URL  | `http://localhost:3030/api` |
| `VITE_APP_NAME`     | App display name | `DevTinder`                 |

---

## Deployment

The project is ready to deploy on Render:

```bash
# Build command (set this on Render)
npm run render-build

# Start command
npm run start
```

**Production settings:**

- Set `NODE_ENV=production`
- The server automatically serves the `client/dist` folder as static files
- Cookie settings change to: `secure: true`, `sameSite: "none"`
- Set `FRONTEND_URL` to your production URL

---

## Key Concepts Summary

| Concept               | Implementation                                            |
| --------------------- | --------------------------------------------------------- |
| **Authentication**    | JWT token in httpOnly cookie                              |
| **Authorization**     | `userAuth` middleware on protected routes                 |
| **Password Security** | bcrypt hash (salt rounds: 10)                             |
| **Validation**        | validator.js (email, strong password) + custom validators |
| **State Management**  | Redux Toolkit (3 slices: user, feed, connection)          |
| **Routing**           | React Router v7 + ProtectedRoute component                |
| **Styling**           | TailwindCSS v4 + DaisyUI v5                               |
| **API Calls**         | Axios with `withCredentials: true`                        |
| **CORS**              | Express cors middleware (credentials + specific origin)   |
| **Database**          | MongoDB Atlas + Mongoose ODM                              |

---

_Built with the MERN Stack_
