const dns = require('node:dns');

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose')

if (process.argv.length < 5) {
   console.log('give password as argument')
   process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://gad123:${password}@cluster0.thlh3ne.mongodb.net/noteApp?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
   content: String,
   important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//    content: 'HTML is easy',
//    important: true,
// })

const note = new Note({
   content: process.argv[3],
   important: process.argv[4] === 'true' ? true : false ,
})


note.save().then(result => {
   console.log('note saved!')
   mongoose.connection.close()
})

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

