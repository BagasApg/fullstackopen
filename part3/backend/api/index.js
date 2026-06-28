const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(process_cwd(), 'dist')))

let notes = [
   { id: "1", content: "HTML is easy", important: true },
   { id: "2", content: "Browser can execute only JavaScript", important: false },
   { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
]

const generateId = () => {
   if (notes.length === 0) return "1"
   
   // Menggunakan .reduce() jauh lebih aman dibanding Math.max(...spread) di serverless
   const maxId = notes.reduce((max, note) => {
      const idNum = Number(note.id)
      return idNum > max ? idNum : max
   }, 0)

   return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
   const body = request.body

   if (!body.content) {
      return response.status(400).json({
         error: "content missing"
      })
   }

   const note = {
      content: body.content,
      important: body.important || false,
      id: generateId()
   }

   notes = notes.concat(note)

   response.json(note)

})

// app.get('/', (request, response) => {
//    response.send("<h1>Hello World!</h1>")
// })

app.get('/api/notes', (request, response) => {
   response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
   const id = request.params.id
   const note = notes.find(note => note.id === id)

   if (note) {

      response.json(note)
   } else {
      response.status(404).end()
   }
})

app.delete('/api/notes/:id', (request, response) => {
   const id = request.params.id
   notes = notes.filter(note => note.id !== id)

   response.status(204).end()
})

if (process.env.NODE_ENV !== 'production') {
   const PORT = process.env.PORT || 3001
   app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
   })
}

module.exports = app

