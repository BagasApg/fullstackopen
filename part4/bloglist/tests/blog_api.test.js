const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')

const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blog')

const api = supertest(app)

//

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
  console.log('ready!')

})

test.only('blogs returned in JSON format', async () => {
  console.log('starting test...')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('blogs returned are in the correct amount', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
