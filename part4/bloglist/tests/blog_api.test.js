const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')

const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blog')

const api = supertest(app)

test

after(async () => {
  await mongoose.connection.close()
})
