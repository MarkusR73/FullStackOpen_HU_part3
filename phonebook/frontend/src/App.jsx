import {useState, useEffect} from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/Forms'
import personService from './services/perser'
import {Added, Error} from './components/Notifications'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [addedMessage, setAddedMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect (() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error fetching data:', error) // Log any errors
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some((person) => person.name === newName.trim())
    const numberExists = persons.some((person) => person.number === newNumber.trim())

    
    if (numberExists) {
      alert(`${newNumber} is already added to the phonebook`)
      return // Cancel further execution
    }
    else if (nameExists && !numberExists) {
      if (window.confirm(`${newName.trim()} is already added to the phonebook, replace the old number with a new one?`)){
        const personObject = {
          name: newName.trim(),
          number: newNumber.trim(),
        }
        const person = persons.find(p => p.name === newName.trim())
        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === person.id ? returnedPerson : p))
            setAddedMessage(`Updated ${newName.trim()}`)
            setTimeout(() => {setAddedMessage(null)}, 3000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(`Information of '${newName.trim()}' has already been removed from server`)
            setTimeout(() => {setErrorMessage(null)}, 5000)
            setPersons(persons.filter(p => p.name !== newName.trim()))
          })
      }
      else {
        return // Cancel further execution
      }

    }
    else {
      const personObject = {
        name: newName.trim(),
        number: newNumber.trim(),
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setAddedMessage(`Added ${newName}`)
          setTimeout(() => {setAddedMessage(null)}, 3000)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)){
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          alert(`Failed to delete '${person.name}' from the server`);
        })
    }
  }

  const updateName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const updateNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const updateFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Added message={addedMessage}/>
      <Error message={errorMessage}/>
      <Filter value={filter} onChange={updateFilter}/>
      <h3>add a new</h3>
      <PersonForm 
        onSubmit={addPerson}
        newName={newName}
        updateName={updateName}
        newNumber={newNumber}
        updateNumber={updateNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App