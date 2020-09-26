const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('../security/bcrypt')
const jwt = require('../security/jwt')
const Task = require('./tasks')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: false,
        validate(value) {
            if (value < 0){
                throw new Error('Age must be a positive number!')
            }
        },
        default: 0
    },
    email: {
        type: String,
        required: true,
        validator(value) {
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        },
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validator(value) {
            if (value.includes('password')){
                throw new Error('Password cannot contain word : password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

usersSchema.virtual('tasks', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'owner'
})


//To prevent passwords and tokens from showing up
usersSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}

usersSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.generateToken(user.id.toString())
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

usersSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to login.')
    }
    const isPasswordMatch = await bcrypt.comparePassword(password, user.password)
    if(!isPasswordMatch){
        throw new Error('Unable to login.')
    }
    return user
}

//Hash plaintext password before saving
usersSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.encryptPassword(user.password)
    }
    next()
})

//Remove a user's tasks if user is removed
usersSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('users', usersSchema)

module.exports = User