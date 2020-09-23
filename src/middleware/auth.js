const jwt = require('jsonwebtoken')
const Users = require('../models/users')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisaspecialkeyfortoken')
        const user = await Users.findOne({_id: decoded.id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        req.user = user
        next()
    }catch(error){
        res.status(401).send({error: 'User cannot be authenticated'})
    }
}

module.exports= {
    auth
}