const appid = import.meta.env.VITE_SOME_KEY
import axios from 'axios'


const getWeather = (lat, lon) => {
   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}&units=metric`
   const request = axios
               .get(url)
   return request
               .then(response => response.data)
}


export default getWeather
