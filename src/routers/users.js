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


//Delete user by id
usersRouter.delete('/users/me', auth.auth, async(req, res) => {
    try{
        await req.user.remove()
        res.status(200).send(req.user)
    }catch (error){
        res.status(500).send('User deleted')
    }
})


//Update user by id
usersRouter.patch('/users/me', auth.auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({error : 'Invalid update attribute on user'})
    }
    else{
        try{
            updates.forEach((update) => req.user[update] = req.body[update])
            await req.user.save()

            res.status(200).send({'User Updated': req.user})
        }catch(error){
            res.status(500).send()
        }
    }
})


//User logout
usersRouter.post('/users/logout', auth.auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(201).send('Logged Out.')
    }catch (error){
        res.status(500).send()
    }
})


//Logout from all sessions
usersRouter.post('/users/logoutAll', auth.auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(201).send('Logged out from all sessions.')
    }catch(error){
        res.status(500).send()
    }
})
module.exports = usersRouter