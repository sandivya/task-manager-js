const express = require('express')
const usersRouter = new express.Router()
const Users = require('../models/users')
const { Router } = require('express')
require('../db/mongoose')
const auth = require('../middleware/auth')


//Create a new user
usersRouter.post('/users', async(req, res) => {
    const user = new Users(req.body)  
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(error){
        res.status(400).send(error)
    }
})


//User login
usersRouter.post('/users/login', async (req, res) => {
    try{
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

//Fetching User Profile
usersRouter.get('/users/me', auth.auth, async (req, res) => {
    res.status(201).send(req.user)
})


//Fetch User by id
usersRouter.get('/users/:id', async (req, res) => {
    id = req.params.id
    try{
        const user = await Users.findById(id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user).status(200)
    }catch(error){
        res.status(500).send(error)
    }
})


//Delete user by id
usersRouter.delete('/users/:id', async(req, res) => {
    try{
        const user = await Users.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send({ error: "User not found." })
        }
        res.status(200).send(user)
    }catch (error){
        res.status(500).send()
    }
})


//Update user by id
usersRouter.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({error : 'Invalid update attribute on user'})
    }
    else{
        try{
            const user = await Users.findById(req.params.id)
            updates.forEach((update) => user[update] = req.body[update])
            await user.save()

            if(!user){
                return res.status(400).send({ error: 'No user found' })
            }
            res.status(200).send(user)
        }catch(error){
            res.status(500).send()
        }
    }
})

module.exports = usersRouter