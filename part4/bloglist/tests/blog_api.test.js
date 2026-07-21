const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')

const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blog')

const api = supertest(app)

console.log(helper.initialBlogs)

//

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
  console.log('ready!')

})

// exercise 4.8
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

// exercise 4.9
test('blogs returned have the id property instead of _id', async () => {
  const response = await api.get('/api/blogs')

  const allHaveId = response.body.every(blog => blog.id !== undefined && blog._id === undefined)

  assert.strictEqual(allHaveId, true)
})

// exercise 4.10
test.only('new blog can be successfully added', async () => {
  const newBlog = {
    title: 'Erat vel, malesuada, pulvinar odio bibendum pulvinar ut in amet euismod vestibulum. Fermentum et.',
    author: 'Azure',
    url: 'erat.sum.com',
    likes: 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // to check if blogs amount is changed
  const notesAtEnd = await helper.blogsInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length + 1)

  // to check if added blog is really there
  const contents = notesAtEnd.map(blog => blog.title)
  assert(contents.includes(newBlog.title))

  // to actually check, properties by properties, if added blog is really there
  const specificContents = notesAtEnd.map(blog => ({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
  }))

  assert.deepStrictEqual(specificContents[2], newBlog)

})

test.only('blog with likes property missing can still be added with the likes set 0 as default', async () => {
  const newBlog = {
    title: 'Erat vel, malesuada, pulvinar odio bibendum pulvinar ut in amet euismod vestibulum. Fermentum et.',
    author: 'Azure',
    url: 'erat.sum.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)



  // to check if blogs amount is changed
  const notesAtEnd = await helper.blogsInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length + 1)

  // to check if added blog is really there
  const contents = notesAtEnd.map(blog => blog.title)
  assert(contents.includes(newBlog.title))

  // to check if added blog has 0 like
  assert.strictEqual(notesAtEnd[2].likes, 0)

})

after(async () => {
  await mongoose.connection.close()
})
