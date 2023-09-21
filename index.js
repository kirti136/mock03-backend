require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { connectDB } = require("./db");
const { userRouter } = require("./routes/user.route");
const { bookRouter } = require("./routes/book.route");
const { orderRouter } = require("./routes/order.route");

const app = express();

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Masai Library API",
      version: "1.0.0",
      description: "API for Masai Library",
    },
    servers: [
      {
        url: "http://localhost:8080/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// Swagger specification
const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
app.use(cors());
app.use("/api", userRouter);
app.use("/api", bookRouter);
app.use("/api", orderRouter);
app.use("/documentations", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(201).json({ message: "Welcome to Masai Library" });
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server running on port ${process.env.PORT}`);
});
