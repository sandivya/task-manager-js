const express = require('express')
const usersRouter = require('./routers/users')
const tasksRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) //Automatically parses incoming JSON from a request
app.use(usersRouter)
app.use(tasksRouter)


//Start Task-Manager
app.listen(port, () => {
    console.log('Task-Manager started on port :', port)
})
