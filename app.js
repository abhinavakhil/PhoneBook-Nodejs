const express = require("express");
const morgan = require("morgan");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const contactRouter = require("./routes/contactRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
// 1.) GloBAL Middlewares

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Test middleware
// app.use((req, res, next) => {
//   console.log('hello from midddleware');
//   next();
// });

// 3) Routes : and Mounting the routers//
app.use("/api/v1/contacts", contactRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// server
module.exports = app;
