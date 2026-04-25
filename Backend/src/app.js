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

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(healthRoutes);
app.use(lookupRoutes);
app.use(searchRoutes);
app.use(mapRoutes);
app.use(fhirRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;