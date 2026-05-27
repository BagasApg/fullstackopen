import { useState, useEffect } from 'react'
import axios from 'axios'

import Result from './components/Result'

import getWeather from './services/weather'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  const countriesToShow = countries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const returnedCountries = response.data
        setCountries(returnedCountries)
      })
  }, [])

  useEffect(() => {
    if (countriesToShow.length === 1) {
      // console.log('prep!', countriesToShow[0].latlng[0], countriesToShow[0].latlng[1])
      console.log(countriesToShow[0].capitalInfo)

      getWeather(countriesToShow[0].capitalInfo.latlng[0], countriesToShow[0].capitalInfo.latlng[1])
        .then(returnedWeather => {
          setWeather(returnedWeather)
        })
        .catch(() => {
          console.log('failed')
        })
    }
  }, [countriesToShow.length])

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const modifySearch = (countryName) => {
    setSearch(countryName)
  }


  return (
    <div>
      find countries <input onChange={handleSearch} /> <br />
      <Result countries={countriesToShow} search={search} modifySearch={modifySearch} weather={weather}></Result>
    </div>
  )
}
export default App
