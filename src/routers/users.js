const express = require('express')
const usersRouter = new express.Router()
const Users = require('../models/users')
const dboperations = require('../db/db-operations')
const User = require('../models/users')
require('../db/mongoose')

//Create a new user
usersRouter.post('/users', async(req, res) => {
    const user = new Users(req.body)  
    try{
        await user.save()
        res.status(201).send(user)
        console.log('User Created :', user.name)
    }catch(error){
        res.status(400).send(error)
        console.log('User Creation Failed :', error)
    }
})


//Fetching All User
usersRouter.get('/users', async (req, res) => {
    try{
        const users = await Users.find({})
        res.status(200).send(users)
        console.log('Users Fetched', users)
    }catch(error){
        res.status(500).send(error)
        console.log('User Fetching Failed :', error)
    }
})


//Fetch User by id
usersRouter.get('/users/:id', async (req, res) => {
    id = req.params.id
    try{
        const user = await Users.findById(id)
        if(!user){
            console.log('User not found with id :', id)
            return res.status(404).send()
        }
        res.send(user).status(200)
        console.log('User found :', user.name)
    }catch(error){
        res.status(500).send(error)
        console.log('Error occurred while finding user :', id)
    }
})


//Delete user by id
usersRouter.delete('/users/:id', async(req, res) => {
    try{
        const user = await Users.findByIdAndDelete(req.params.id)

        if(!user){
            console.log('User not found :', req.params.id)
            res.status(404).send({ error: "User not found." })
        }
        console.log('User Deleted :', user.name)
        res.status(200).send(user)
    }catch (error){
        console.log('An error occurred while deleting user .', error)
        res.status(500).send()
    }
})


//Update user by id
usersRouter.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        console.log('Invalid update attribute on user')
        res.status(400).send({error : 'Invalid update attribute on user'})
    }
    else{
        try{
            // const user = await dboperations.usersUpdateInfo(req.params.id, req.body)
            const user = await Users.findById(req.params.id)
            updates.forEach((update) => user[update] = req.body[update])
            await user.save()

            if(!user){
                console.log('No user found with id :', req.params.id)
                return res.status(400).send({ error: 'No user found' })
            }
            console.log('User details updated :', user)
            res.status(200).send(user)
        }catch(error){
            console.log('An error occurred while updating user.', error)
            res.status(500).send()
        }
    }
})

module.exports = usersRouter