const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('users', {
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
        lowercase: true
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
    }
})

module.exports = User