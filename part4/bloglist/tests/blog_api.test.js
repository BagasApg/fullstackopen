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

test('blogs returned in JSON format', async () => {
  console.log('starting test...')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs returned are in the correct amount', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('blogs returned have the id property instead of _id', async () => {
  const response = await api.get('/api/blogs')

  const allHaveId = response.body.every(blog => blog.id !== undefined && blog._id === undefined)

  assert.strictEqual(allHaveId, true)
})

after(async () => {
  await mongoose.connection.close()
})
