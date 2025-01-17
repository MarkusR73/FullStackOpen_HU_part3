const Person = ({person, onClick}) => {
    return (
      <p>
        {person.name} {person.number} <button onClick={onClick}>Delete</button>  
      </p>
    )
  }

const Persons = ({persons, removePerson}) => {
  return(
    <p>{persons.map(person => 
      <Person 
        key={person.id} 
        person={person}
        onClick={() => removePerson(person.id)}
      />
    )}</p>
  )
}
  
export default Persons