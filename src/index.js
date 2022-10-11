const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const authController = require("./controllers/auth.controller");
const productController = require("./controllers/product.controller");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local Server",
      },
    ],
  },
  apis: ["./src/controllers/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/user", authController);
app.use("/products", productController);

module.exports = app;
