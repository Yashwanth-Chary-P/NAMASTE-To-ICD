const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const lookupRoutes = require("./routes/lookup.routes");
const searchRoutes = require("./routes/search.routes");
const mapRoutes = require("./routes/map.routes");
const fhirRoutes = require("./routes/fhir.routes");

const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ ADD HERE
 

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// 🔥 Hide 404 logs
app.use(
  morgan("dev", {
    skip: (req, res) => res.statusCode === 404
  })
);

// ===============================
// FIX ROOT ROUTE (/)
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "NAMASTE Backend API running 🚀",
    status: "ok",
    endpoints: [
      "/health",
      "/search",
      "/lookup/:system/:code",
      "/map",
      "/fhir/store"
    ]
  });
});

// ===============================
// FIX FAVICON REQUEST
// ===============================
app.get("/favicon.ico", (req, res) => res.status(204).end());

// ===============================
// ROUTES
// ===============================
app.use(healthRoutes);
app.use(lookupRoutes);
app.use(searchRoutes);
app.use(mapRoutes);
app.use(fhirRoutes);

// ===============================
// ERROR HANDLING
// ===============================
app.use(notFound);
app.use(errorHandler);

module.exports = app;