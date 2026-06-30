const express = require('express')
const cors = require('cors')
const app = express()

const morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :attr'))
// app.use(morgan('tiny'))

// Morganism
morgan.token('attr', function getAttr(req, res) {

   if (req.method === "GET") {
      return JSON.stringify(req.body)
   }
   return ' '
})
// END of morganism

let persons = [
   {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
   },
   {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
   },
   {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
   },
   {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
   }
]

app.get('/', (request, response) => {
   response.send("<h1>Yahu</h1>")
})

app.get('/info', (request, response) => {
   const now = new Date();
   const total = persons.length
   response.send(`
<p>Phonebook has info for ${total} people</p>
<p>${now}</p>

`)
})

app.get('/api/persons', (request, response) => {
   response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
   const id = request.params.id

   const person = persons.find(n => n.id === id)

   if (person) {
      response.json(person)
   } else {
      response.status(404).end()
   }
})

const generateID = () => {
   const newID = Math.round(Math.random() * 12901093)

   while (persons.find(person => person.id === newID)) {
      newID = Math.round(Math.random() * 12901093)
   }

   return String(newID)
}

generateID()

app.post('/api/persons', (request, response) => {
   const body = request.body

   // validations
   if ((!body.name) || (!body.number)) {
      return response.status(400).json([{ error: "The name or number is missing" }])
   }


   // Validations with specific causes
   // if (!body.number) {
   //    return response.status(400).json([{ error: "The number is missing" }])
   // }
   // if (!body.name) {
   //    return response.status(400).json([{ error: "The name is missing" }])
   // }

   // duplicate
   if (persons.find(p => p.name === body.name)) {
      return response.status(400).json([{ error: "name must be unique pwease" }])
   }

   const person = {
      id: generateID(),
      name: body.name,
      number: body.number
   }

   persons = persons.concat(person)

   response.json(person)


})

app.delete('/api/persons/:id', (request, response) => {
   const id = request.params.id

   persons = persons.filter(person => person.id !== id)

   response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})
