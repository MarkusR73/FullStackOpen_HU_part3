const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.static('dist'))

app.use(express.json())

app.use(cors())


morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan('tiny', {
  skip: (request) => request.method === 'POST'
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // CastError handling (malformed ID)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  // If the error is not handled explicitly, pass it to the default error handler
  next(error)
}

const Person = require('./models/person')

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person
    .countDocuments()
    .then(count => {
      const currentDate = new Date()
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentDate.toString()}</p>
      `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        // if a note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found
        response.status(404).end
      }
    })
    // If the format of the id is incorrect, then we will end up in the error handler
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({
    name: name,
    number: number
  })
  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    // constraints causing possible errors defined in person.js
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(
      request.params.id,
      person,
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      console.log('Updated Person:', updatedPerson)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})