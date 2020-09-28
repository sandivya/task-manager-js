const express = require('express')
const usersRouter = new express.Router()
const Users = require('../models/users')
const { Router } = require('express')
require('../db/mongoose')
const auth = require('../middleware/auth')
const multer = require('multer')
const User = require('../models/users')
const sharp = require('sharp')
const { sendWelcomeMail, sendGoodbyeMail } = require('../emails/account')

//Instantiating multer for avatar upload
const avatarsUpload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){        
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be a JPG/JPEG/PNG image'))
        }
        cb(undefined, true)
    }
})


//Create a new user
usersRouter.post('/users', async(req, res) => {
    const user = new Users(req.body)  
    try{
        await user.save()
        sendWelcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(error){
        console.log()
        res.status(400).send()
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


// Add User profile image
usersRouter.post('/users/me/avatars', auth.auth, avatarsUpload.single('avatar'), async (req, res) => {
    req.user.avatar = await sharp(req.file.buffer).png().resize({width: 250, height: 250}).toBuffer()
    await req.user.save()
    res.status(200).send('Avatar uploaded successfully')
}, (error, req, res, next) => {
    res.status(404).send({'error': error.message})
})


//Remove avatar
usersRouter.delete('/users/me/avatars', auth.auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send('Avatar deleted successfully.')
})


//Fetch avatar
usersRouter.get('/users/me/avatars', auth.auth, async(req, res) => {
    try{
        const user = await User.findById(req.user.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch (error){
        res.status(404).send()
    }
})


//Delete user by id
usersRouter.delete('/users/me', auth.auth, async(req, res) => {
    try{
        await req.user.remove()
        sendGoodbyeMail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    }catch (error){
        console.log(error)
        res.status(500).send()
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