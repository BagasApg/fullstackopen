const Result = ({ countries, search, modifySearch, weather }) => {
   if (search === '') {
      return
   }
   if (countries.length === 0) {
      return <>sg nggenah es</>
   }
   if (countries.length > 10) {
      return <>Too many matches, specify.</>
   }
   if (countries.length > 1) {
      return (
         <div>
            {countries.map(c => (
               <div key={c.cca3}>{c.name.common}
                  <button onClick={() => modifySearch(c.name.common)}>Show</button>
               </div>
            ))}
         </div>
      )
   }

   const specified = countries[0]
   console.log(weather)
   return (
      <div>
         <h1>{specified.name.common}</h1>
         <p>{specified.capital || "No capital"}</p>
         <p>Area {specified.area}</p>
         <h2>Languages</h2>
         <ul>
            {Object.values(specified.languages || {}).map(l => (
               <li key={l}>{l}</li>
            ))}
         </ul>
         <img src={specified.flags.png} alt="" />
         <h1>Weather in {specified.capital}</h1>
         {weather && (
            <div>
               <p>Temperature {weather.main.temp} Celcius</p>
               <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}%402x.png`} alt="" />
               <p>Wind {weather.wind.speed}</p>
            </div>
         )}
      </div>
   )


}

export default Result
