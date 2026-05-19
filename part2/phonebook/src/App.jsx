import { useState } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas', number: '040-123456', id: 1 },
		{ name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
		{ name: 'Dan Abramov', number: '12-43-234345', id: 3 },
		{ name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }

	])
	const [newPerson, setNewPerson] = useState({
		name: '',
		number: ''
	})
	const [search, setSearch] = useState('')

	const addPerson = (event) => {
		event.preventDefault()
		if (persons.some((person) => {
			return ((person.name === newPerson.name) || (person.number === newPerson.number))
		})) {
			alert(`${newPerson.name} is already added to phonebook`)
		} else {

			setPersons(persons.concat(newPerson))
			setNewPerson({ name: '', number: '' })

		}

	}

	const handleNameInput = (event) => {
		setNewPerson({
			...newPerson,
			name: event.target.value
		})
	}

	const handleNumberInput = (event) => {
		setNewPerson({
			...newPerson,
			number: event.target.value
		})
	}

	const handleSearchInput = (event) => {
		setSearch(event.target.value)
	}

	const personsToShow = persons.filter(person => person.name.includes(search))

	return (
		<div>
			<h2>Phonebook</h2>
			<Filter onChange={handleSearchInput} />
			
			<h2>add a new</h2>
			<PersonForm addPerson={addPerson} handleNameInput={handleNameInput} handleNumberInput={handleNumberInput} />

			<h2>Numbers</h2>
			<Persons personsToShow={personsToShow} />
		</div>
	)
}

export default App
