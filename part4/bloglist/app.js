const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')

const blogsRouter = require('./controller/blogs')

const app = express()

// SRV error
const dns = require('node:dns')
dns.setServers(['1.1.1.1', '8.8.8.8'])
//

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.error('error connection to mongodb', error.message)
  })

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
