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
        console.log('Task created successfully :', task.description)
    }catch(error){
        res.status(400).send(error)
        console.log('Task creation failed :', task.description || 'NA')
    }
})


// Get all tasks
tasksRouter.get('/tasks', async(req, res) => {
    try{
        const task = await Tasks.find({})
        if(task.length === 0){
            console.log('No task found.')
            return res.status(404).send()
        }
        res.status(201).send(task)
        console.log('Task found : \n', task)
    }catch(error){
        res.status(500).send()
        console.log('An error occurred while fetching tasks list : ', error)
    }
})


//Get task by id
tasksRouter.get('/tasks/:id', async (req, res) => {
    const id = req.params.id
    try{
        const task = await Task.findById(id)       
        if(!task){
            console.log('No task found with id :', id)
            return res.status(404).send()
        }
        res.status(201).send(task)
        console.log('Task found :', task.description)
    }catch(error) {
        res.status(500).send()
        console.log('An error occurred while fetching tasks list.')
    }
})


//Delete Task by id
tasksRouter.delete('/tasks/:id', async (req, res) => {
    try{
        const [task, count] = await dboperations.tasksDeleteAndCountUncompleted(req.params.id)
        if (!count){
             console.log('No task left.')
             return res.status(200).send('No task left.')
        }
        console.log('Task left :', count)
        res.status(200).send(task)
    }catch(error){
       console.log('An error occurred while delete and fetchig incomplete count task.', error)
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
                        console.log('No task left.')
                        return res.status(200).send('No task left.')
                }
            console.log('Task still incomplete :', count)
            res.status(200).send(task)
        }catch (error){
            res.status(400).send(error)
            console.log('An error occurred while updating task status and fetchig incomplete count task.')
        }
    }
})

module.exports = tasksRouter