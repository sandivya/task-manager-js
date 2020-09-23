const Task = require('../models/tasks')
const User = require('../models/users')
require('./mongoose')
require('../models/tasks')
require('../models/users')

const tasksDeleteAndCountUncompleted = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const countRemain = await Task.countDocuments({ completed: false })
    return [task, countRemain]
}


const tasksUpdateStatusAndCount = async (id, reqBody) => {
    const task = await Task.findByIdAndUpdate(id, reqBody, { new: true, runValidators: true })
    const countRemain = await Task.countDocuments({ completed: false })
    return [task, countRemain]
}

const usersUpdateInfo = async (id, reqBody) => {
    const user = await User.findByIdAndUpdate(id, reqBody, { new: true, runValidators: true })
    return user
}


module.exports = {
    tasksDeleteAndCountUncompleted,
    tasksUpdateStatusAndCount,
    usersUpdateInfo
}