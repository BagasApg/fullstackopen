import { useState, useEffect } from 'react'
import personService from './services/notes.js'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import Notification from './components/Notification.jsx'

import './style.css'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newPerson, setNewPerson] = useState({
		name: '',
		number: ''
	})
	const [search, setSearch] = useState('')
	const [alertMessage, setAlertMessage] = useState(null)
	const [alertType, setAlertType] = useState('')

	const hook = () => {
		personService
			.getAll()
			.then(initialPersons => {
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
					setAlertMessage(`Added ${returnedPerson.name}`)
					setAlertType('success')
					setTimeout(() => {
						setAlertMessage(null)
						setAlertType('')
					}, 3000)
					setPersons(persons.concat(returnedPerson))
				})
				.catch(error => {
					console.log(error.response.data.error)
					setAlertMessage(error.response.data.error)
					setAlertType('danger')
					setTimeout(() => {
						setAlertMessage(null)
						setAlertType('')
					}, 7000)
				})
		}
	}

	const deletePerson = (id) => () => {
		const person = persons.find(n => n.id === id)
		if (window.confirm(`Delete ${person.name} ?`)) {

			personService
				.remove(id)
				.then(deletedPerson => {
					const personsAfterDelete = persons.filter(p => p.id !== id)
					setPersons(personsAfterDelete)
				})
				.catch(error => {
					setAlertMessage(`Information of ${person.name} has already been removed from server`)
					setAlertType('danger')
					setTimeout(() => {
						setAlertMessage(null)
						setAlertType('')
					}, 3000)
					setPersons(persons.filter(p => p.id !== id))
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
			<Notification type={alertType} message={alertMessage} />
			<Filter onChange={handleSearchInput} />

			<h2>add a new</h2>
			<PersonForm addPerson={addPerson} handleNameInput={handleNameInput} handleNumberInput={handleNumberInput} />

			<h2>Numbers</h2>
			<Persons personsToShow={personsToShow} deletePerson={deletePerson} />
		</div>
	)
}

export default App
