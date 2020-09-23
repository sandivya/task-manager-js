const jwt = require('jsonwebtoken')

const generateToken = async (id) => {
    return jwt.sign({id}, 'thisisaspecialkeyfortoken')
}

module.exports = {
    generateToken
}