const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/users')
const {user_sandivya, user_sandivya_id, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)

//SignUp a user - POSITIVE
test('Should SignUp a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Sandivya',
        email: 'sandivya222.saxena@gmail.com',
        password: 'Sandivya@1996'
    }).expect(201)

    const user = await User.findById(user_sandivya_id)
    expect(user).not.toBeNull()

})

//Login a user - POSITIVE
test('Should Login a user', async() => {
    const response = await request(app).post('/users/login').send({
        email: user_sandivya.email,
        password: user_sandivya.password
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

//Not login a non-existent user - NEGATIVE
test('Should not login non-existent user', async() => {
    await request(app).post('/users/login').send({
        email: 'test@test.com',
        password: 'test@1234'
    }).expect(400)
})

//Get user profile
test('Should get user profile for authenticated user', async() => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${user_sandivya.tokens[0].token}`)
        .send()
        .expect(201)
})

//Get user profile fail for unauthenticated user
test('Should not get profile for unauthenticated user', async() => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

//Delete profile for authenticated user
test('Should delete account for authneticated user', async() => {
    await request(app).delete('/users/me').set('Authorization', `Bearer ${user_sandivya.tokens[0].token}`).send().expect(200)
    const user = await User.findOne({email: user_sandivya.email })
    expect(user).toBeNull()
})

//Not Delete profile for authenticated user
test('Should NOT delete account for unauthneticated user', async() => {
    await request(app).delete('/users/me').send().expect(401)
})

test('Should upload avatar', async() => {
    await request(app).post('/users/me/avatars')
        .set('Authorization', `Bearer ${user_sandivya.tokens[0].token}`)
        .attach('avatar' , 'test/fixtures/PicsArt_11-21-11.48.56.jpg')
        .expect(200)

    const user = await User.findById(user_sandivya_id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test('Should update valid user fields', async() => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${user_sandivya.tokens[0].token}`)
        .send({
            email: 'saxenasandivya2222@gmail.com'
        }).expect(200)

    const user = await User.findById(user_sandivya_id)
    expect(user.email).toBe('saxenasandivya2222@gmail.com')
})

test('Should NOT update invalid user fields', async() => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${user_sandivya.tokens[0].token}`)
        .send({
            location: 'India'
        }).expect(400)
})