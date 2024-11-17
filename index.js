const express = require('express');
const connectToDB = require('./config/db');
const userRouter = require('./routers/user.router');
const assignmentRouter = require('./routers/assignment.router');
const { swaggerUi, specs } = require('./helpers/swagger');
const { errorHandler } = require('./middlewares/error.middleware');
require('dotenv').config();

const port = process.env.PORT;

connectToDB()

const app = express()

app.use(express.json())

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// API routes
app.use('/', userRouter)
app.use('/assignments', assignmentRouter)

// Error handling middleware
app.use(errorHandler)

app.listen(port)