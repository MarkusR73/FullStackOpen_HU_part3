const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    // '-' is included in the lenght -> at least 8 digits + '-'
    minLength: 9,
    required: true,
    validate: {
      validator: function(v) {
        // \d{2,3}: The first part has 2 or 3 digits
        // -: A hyphen separates the two parts
        // \d{5,-}: The second part has at least 5 digits
        const phoneDigits = /^(?:\d{2,3}-\d{5,})$/
        return phoneDigits.test(v)
      }
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)