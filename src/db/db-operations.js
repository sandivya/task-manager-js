const Task = require('../models/tasks')
const User = require('../models/users')
require('./mongoose')
require('../models/tasks')
require('../models/users')

const tasksDeleteAndCountUncompleted = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    console.log('Task Deleted : ', task.description)
    const countRemain = await Task.countDocuments({ completed: false })
    return [task, countRemain]
}


const tasksUpdateStatusAndCount = async (id, reqBody) => {
    const task = await Task.findByIdAndUpdate(id, reqBody, { new: true, runValidators: true })
    console.log('Task updated :', task.description)
    const countRemain = await Task.countDocuments({ completed: false })
    return [task, countRemain]
}

const usersUpdateInfo = async (id, reqBody) => {
    const user = await User.findByIdAndUpdate(id, reqBody, { new: true, runValidators: true })
    console.log('User info updated :', user.name)
    return user
}


module.exports = {
    tasksDeleteAndCountUncompleted,
    tasksUpdateStatusAndCount,
    usersUpdateInfo
}