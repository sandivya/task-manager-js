const Task = require('../models/tasks')
const User = require('../models/users')
require('./mongoose')
require('../models/tasks')
require('../models/users')

const tasksDeleteAndCountUncompleted = async (taskid, owner) => {
    const task = await Task.findOneAndDelete({_id: taskid, owner})
    return task
}


const tasksUpdateStatusAndCount = async (taskid, owner, reqBody) => {
    const task = await Task.findOneAndUpdate({_id: taskid, owner}, reqBody, { new: true, runValidators: true })
    return task
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