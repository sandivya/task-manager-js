const bcrypt = require('bcryptjs')

const encryptPassword = async(password) => {
    //console.log(bcrypt.hash(password, 8))
    return await bcrypt.hash(password, 8)
}

module.exports = {
    encryptPassword
}