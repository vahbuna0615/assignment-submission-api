const express = require('express');
const connectToDB = require('./config/db');
const userRouter = require('./routers/user.router');
const assignmentRouter = require('./routers/assignment.router');
const { swaggerUi, specs } = require('./helpers/swagger');
const { errorHandler } = require('./middlewares/error.middleware');
require('dotenv').config();

connectToDB()

const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/', userRouter)
app.use('/assignments', assignmentRouter)

app.use(errorHandler)

app.listen(3000)