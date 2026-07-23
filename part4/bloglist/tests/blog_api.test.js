const assert = require('node:assert')
const { describe, test, after, beforeEach } = require('node:test')

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
test('new blog can be successfully added', async () => {
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
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  // to check if added blog is really there
  const contents = blogsAtEnd.map(blog => blog.title)
  assert(contents.includes(newBlog.title))

  // to actually check, properties by properties, if added blog is really there
  const specificContents = blogsAtEnd.map(blog => ({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
  }))

  assert.deepStrictEqual(specificContents[2], newBlog)

})

test('blog with likes property missing can still be added with the likes set 0 as default', async () => {
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
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  // to check if added blog is really there
  const contents = blogsAtEnd.map(blog => blog.title)
  assert(contents.includes(newBlog.title))

  // to check if added blog has 0 like
  assert.strictEqual(blogsAtEnd[2].likes, 0)

})

describe('blog with title or url property missing can not be added', () => {
  test('with no title', async () => {
    const newNoTitle = {
      author: 'Azure',
      url: 'erat.sum.com',
      likes: 33
    }

    await api
      .post('/api/blogs')
      .send(newNoTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)


    // to check if blogs amount is still the same
    const blogsAtEnd = await helper.blogsInDb()
    // console.log(blogsAtEnd.length, helper.initialBlogs.length)
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })

  test('with no url', async () => {

    const newNoUrl = {
      title: 'Erat vel, malesuada, pulvinar odio bibendum pulvinar ut in amet euismod vestibulum. Fermentum et.',
      author: 'Azure',
      likes: 33
    }

    await api
      .post('/api/blogs')
      .send(newNoUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)


    // to check if blogs amount is still the same
    const blogsAtEnd = await helper.blogsInDb()
    // console.log(blogsAtEnd.length, helper.initialBlogs.length)
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })
})

describe('deletion of a blog post', () => {
  test('succeeds with statuscode 204 if id is valid', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe.only('updating a blog post likes', () => {
  test('succeeds with statuscode 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes += 67

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

    assert.strictEqual(blogsAtEnd[0].likes, blogToUpdate.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
