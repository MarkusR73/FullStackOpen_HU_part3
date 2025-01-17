const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://FullstackPhonebook73:${encodeURIComponent(password)}@phonebook-cluster.bah3s.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook-cluster`
// console.log('Connecting to MongoDB...')

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(() => {
        // console.log('Connected to MongoDB')
        const personSchema = new mongoose.Schema({
            name: String,
            number: String,
        })
        const Person = mongoose.model('Person', personSchema)

        if (process.argv.length === 3) {
            // Fetch all persons
            Person.find({})
                .then(persons => {
                    console.log('Phonebook:')
                    persons.forEach(person => {
                        console.log(person.name, person.number)
                    })
                    mongoose.connection.close()
                })
                .catch((error) => {
                    console.error('Error fetching persons:', error)
                    mongoose.connection.close()
                })
        }
        else if (process.argv.length === 5) {
            // Create new person
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })
            person.save()
            .then(result => {
                console.log(`added ${person.name} ${person.number} to phonebook`)
                mongoose.connection.close()
            })
            .catch((error) => {
                console.error('Error saving person:', error)
                mongoose.connection.close()
            })
        }
        else {
            console.log('Incorrect number of arguments')
            mongoose.connection.close()
        }
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
        mongoose.connection.close() 
    })
    

    
    
    
