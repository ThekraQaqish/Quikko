const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Qwikko API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        customerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        vendorAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        adminAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        deliveryAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/modules/**/*.js",
    "./src/infrastructure/**/*.js",
  ],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
