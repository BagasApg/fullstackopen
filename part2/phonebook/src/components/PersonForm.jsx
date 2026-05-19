const PersonForm = (props) => {
   return (
      <form onSubmit={props.addPerson}>
         <div>
            name: <input onChange={props.handleNameInput} />
         </div>
         <div>
            number: <input onChange={props.handleNumberInput} />
         </div>
         <div>
            <button type="submit" >add</button>
         </div>
      </form>
   )
}
export default PersonForm
