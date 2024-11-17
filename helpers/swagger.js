const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Assignment Submission Portal API',
      version: '1.0.0',
      description: 'Swagger documentation for Assignment Submission API'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routers/*.js'] // Path to API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
}