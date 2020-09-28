const express = require('express')
const usersRouter = require('./routers/users')
const tasksRouter = require('./routers/tasks')

const app = express()

app.use(express.json()) //Automatically parses incoming JSON from a request
app.use(usersRouter)
app.use(tasksRouter)

module.exports = app