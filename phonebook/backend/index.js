const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan('tiny', {
    skip: (request, response) => request.method === 'POST'
}))

app.use(morgan((tokens, request, response) => {
    if (request.method === 'POST') {
        console.log([
            tokens.method(request, response),
            tokens.url(request, response),
            tokens.status(request, response),
            tokens.res(request, response, 'content-length'), '-',
            tokens['response-time'](request, response), 'ms',
            `${tokens.body(request, response)}`
        ].join(' '))
    }
}))

const Person = require('./models/person')
let persons = [
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })  
})

app.get('/info', (request, response) => {
    const count = persons.length
    const currentDate = new Date()

    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentDate.toString()}</p>
      `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } 
      else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    const dublicate = persons.find(person => person.name === body.name)
    if (dublicate) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
  
    const person = {
        id: String(Math.floor(Math.random() * 1e6)),  
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    console.log(person)
    response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})