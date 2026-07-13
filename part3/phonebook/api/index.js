require('dotenv').config()

const express = require('express')
const app = express()

const morgan = require('morgan')

const Person = require('./models/person')

app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :attr'),
)
// app.use(morgan('tiny'))

// Morganism
morgan.token('attr', function getAttr(req) {
  if (req.method === 'GET') {
    return JSON.stringify(req.body)
  }
  return ' '
})
// END of morganism

app.get('/', (request, response) => {
  response.send('<h1>Yahu</h1>')
})

app.get('/info', (request, response) => {
  const now = new Date()

  Person.find().then((people) => {
    console.log(people.length)

    response.send(`
      <p>Phonebook has info for ${people.length} people</p>
      <p>${now}</p>
      
      `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find().then((people) => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body
  Person.findByIdAndUpdate(id, body, { returnDocument: 'after' })
    .then((person) => {
      response.status(200).send(person)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // validations
  if (!body.name || !body.number) {
    return response
      .status(400)
      .json([{ error: 'The name or number is missing' }])
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(() => {
      response.json(person)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
