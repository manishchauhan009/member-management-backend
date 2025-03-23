const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/databaseConnection");
const userRoutes = require("./routes/userRoutes");
const memberRoutes = require("./routes/memberRoutes");
const locationRoutes = require("./routes/locationRoutes");
const contentRoutes = require("./routes/contentRoutes");
const imageRoutes=require("./routes/imageRoutes")
const eventRoutes=require("./routes/eventRoutes")
const sendMembershipReminderEmails = require("./services/emailService");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const requiredEnvVars = ["PORT", "EMAIL_USER", "EMAIL_PASS", "FRONTEND_URL"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`ERROR: Missing environment variable: ${key}`);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL.replace(/\/$/, ""), // Remove trailing slash
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/event", eventRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Server is up and running!");
});

app.use(notFound);
app.use(errorHandler);

dbConnect()
  .then(() => {
    console.log("Database connected!");
    sendMembershipReminderEmails(); // Start cron job here
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
