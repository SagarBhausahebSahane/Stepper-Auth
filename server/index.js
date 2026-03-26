const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");

dotenv.config();
const app = express();

connectDB();
app.use(helmet());

// ── Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use("/api", apiLimiter);

// ── Routes
app.use("/api/auth",    require("./routes/authRoutes"));
app.use("/api/user",    require("./routes/userRoutes"));
app.use("/api/encrypt", require("./routes/encryptRoutes"));

app.get("/", (req, res) => res.json({ message: "Server running" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
