import { useState, useEffect } from 'react'
import personService from './services/notes.js'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newPerson, setNewPerson] = useState({
		name: '',
		number: ''
	})
	const [search, setSearch] = useState('')

	const hook = () => {
		personService
			.getAll()
			.then(initialPersons => {
				console.log(initialPersons)
				setPersons(initialPersons)
			})
	}
	useEffect(hook, [])

	const addPerson = (event) => {
		event.preventDefault()
		const existingPerson = persons.find(p => p.name.toLowerCase() === newPerson.name.toLowerCase())
		if (existingPerson) {
			if (!(existingPerson.number === newPerson.number)) {
				if (window.confirm(`${newPerson.name} is already added to phonebook. Replace the old number with a new one?`)) {
					const changedPerson = {
						...existingPerson,
						number: newPerson.number
					}
					personService
						.update(existingPerson.id, changedPerson)
						.then(returnedPerson => {
							setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p))
						})
				}
			}
		} else {
			personService
				.create(newPerson)
				.then(returnedPerson => {
					setPersons(persons.concat(returnedPerson))
				})
				.catch(error => {
					console.log("failed...")
				})
		}
	}

	const deletePerson = (id) => () => {
		const person = persons.find(n => n.id === id)
		console.log(persons)
		if (window.confirm(`Delete ${person.name} ?`)) {

			personService
				.remove(id)
				.then(deletedPerson => {
					const personsAfterDelete = persons.filter(p => p.id !== id)
					setPersons(personsAfterDelete)
				})

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
			<Persons personsToShow={personsToShow} deletePerson={deletePerson} />
		</div>
	)
}

export default App
