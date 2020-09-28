const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/users')
const Task = require('../../src/models/tasks')

const user_sandivya_id = new mongoose.Types.ObjectId()
const user_sandivya = {
    _id: user_sandivya_id,
    name: "Sandivya Saxena",
    email: "saxenasandivya2@gmail.com",
    password: "Sandivya@1996",
    age: 24,
    tokens: [{
        token: jwt.sign({id: user_sandivya_id}, process.env.JWT_SECRET_KEY)
    }]
}

const dummy_user_id = new mongoose.Types.ObjectId()
const dummy_user = {
    _id: dummy_user_id,
    name: "Niklaus Mikaelson",
    email: "klaus@mysticfalls.com",
    password: "Klaus@2000",
    age: 2000,
    tokens: [{
        token: jwt.sign({id: dummy_user_id}, process.env.JWT_SECRET_KEY)
    }]
}

const dummy_task_id = new mongoose.Types.ObjectId()
const dummy_task = {
    _id: dummy_task_id,
    description: 'My dummy task',
    owner: user_sandivya_id
}

const setUpDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new Task(dummy_task).save()
    await new User(user_sandivya).save()
    await new User(dummy_user).save()
}

module.exports = {
    user_sandivya, user_sandivya_id, setUpDatabase
}