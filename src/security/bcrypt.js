const bcrypt = require('bcryptjs')

const encryptPassword = async(password) => {
    return await bcrypt.hash(password, process.env.HASH_ROUND)
}

const comparePassword = async(passwordProvidedByUser, passwordPresentInDb) => {
    return await bcrypt.compare(passwordProvidedByUser, passwordPresentInDb)
}

module.exports = {
    encryptPassword,
    comparePassword
}