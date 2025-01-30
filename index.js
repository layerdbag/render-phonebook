import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})


let contacts = [
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

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const date = new Date(Date.now())

app.get('/info', (req, res) => {
  const info = `
    <div>
      <p>Phonebook has info for ${contacts.length} people</p>
      <p>${date.toString()}</p>
    </div>
  `
  res.send(info)
})

app.get('/api/persons', (req, res) => {
  res.json(contacts)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const contact = contacts.find(person => person.id === id)

  if (contact) {
    res.json(contact)
  } else {
    return res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  contacts = contacts.filter(person => person.id !== id)

  res.status(204).end()

})

const generateId = () => {
  const length = 10000
  return String(Math.floor(Math.random() * length))
}

app.post('/api/persons', (req, res) => {
  const person = req.body

  if (!person.name) {
    return res.status(400).json({
      error: 'name is missing'
    })
  }
  if (!person.number) {
    return res.status(400).json({
      error: 'number is missing'
    })
  }

  const name = contacts.find(contact => contact.name === person.name)

  if (name) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const id = generateId()

  const contact = {
    'id': id,
    'name': person.name,
    'number': person.number
  }
  contacts = contacts.concat(contact)
  res.json(contact)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})