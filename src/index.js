const app = require('./app')
const port = process.env.PORT

//Start Task-Manager
app.listen(port, () => {
    console.log('Task-Manager started on port :', port)
})