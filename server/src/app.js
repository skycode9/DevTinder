// Load environment variables first
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// ============================================
// MIDDLEWARE - ORDER MATTERS!
// ============================================

// 1. Body parsers FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup (app.js me)
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // BAHUT IMPORTANT!
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================

app.get("/check", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "DevTinder API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// ROUTES
// ============================================

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use("/api", authRouter, profileRouter, requestRouter, userRouter);

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  const DIRNAME = path.resolve();
  app.use(express.static(path.join(DIRNAME, "client", "dist")));
  app.use("/*", (_, res) => {
    res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
  });
}

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 3030;

connectDB()
  .then(() => {
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(
        `🌐 Allowed origins: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
      );
    });
  })
  .catch((err) => {
    console.error("❌ Database error:", err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 Shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 Shutting down gracefully");
  process.exit(0);
});
