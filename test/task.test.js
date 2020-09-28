const { response } = require('express')
const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/tasks')
const {user_sandivya, user_sandivya_id, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)


test('Should create task for a user',  async() => {
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${user_sandivya.tokens[0].token}`)
        .send({
            description: 'Test the program'
        }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})