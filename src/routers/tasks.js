const express = require('express')
const tasksRouter = new express.Router()
const Tasks = require('../models/tasks')
const dboperations = require('../db/db-operations')
require('../db/mongoose')

//Create a new task
tasksRouter.post('/tasks', async (req, res) => {
    const task = new Tasks(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(error){
        res.status(400).send(error)
    }
})


// Get all tasks
tasksRouter.get('/tasks', async(req, res) => {
    try{
        const task = await Tasks.find({})
        if(task.length === 0){
            return res.status(404).send()
        }
        res.status(201).send(task)
    }catch(error){
        res.status(500).send()
    }
})


//Get task by id
tasksRouter.get('/tasks/:id', async (req, res) => {
    const id = req.params.id
    try{
        const task = await Task.findById(id)       
        if(!task){
            return res.status(404).send()
        }
        res.status(201).send(task)
        console.log('Task found :', task.description)
    }catch(error) {
        res.status(500).send()
    }
})


//Delete Task by id
tasksRouter.delete('/tasks/:id', async (req, res) => {
    try{
        const [task, count] = await dboperations.tasksDeleteAndCountUncompleted(req.params.id)
        if (!count){
             return res.status(200).send('No task left.')
        }
        res.status(200).send(task)
    }catch(error){
       res.status(500).send()
   }
})


//Update complete status and count incomplete tasks
tasksRouter.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({ error: 'Invalid updates!' })
    }else{
        try{
            const [task, count] = await dboperations.tasksUpdateStatusAndCount(req.params.id, req.body)
            if(!count){
                        return res.status(200).send('No task left.')
                }
            res.status(200).send(task)
        }catch (error){
            res.status(400).send(error)
        }
    }
})

module.exports = tasksRouter