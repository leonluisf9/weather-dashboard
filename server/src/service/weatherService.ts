import dotenv from 'dotenv';
import dayjs, {type Dayjs} from 'dayjs';

// import fs from 'node:fs/promises';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}

// TODO: Define a class for the Weather object

class Weather {
    city: string;
    date: Dayjs | string;
    icon: string;
    iconDescription: string;  
    tempF: number;
    windSpeed: number;
    humidity: number;
   constructor(
      city: string,
      date: Dayjs | string,
      icon: string,
      iconDescription: string,
      tempF: number,
      windSpeed: number,
      humidity: number,
    ) {
      this.city = city;
      this.date = date;
      this.icon = icon;
      this.iconDescription = iconDescription;
      this.tempF = tempF;
      this.windSpeed = windSpeed;
      this.humidity = humidity;
    }
};

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseUrl: string;
  apiKey: string;
  cityName: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || ''; 
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

// TODO: Create fetchLocationData method
private async fetchLocationData(query: string) {
  try {
    let response = await fetch(query);
    let locationData = response.json();
    return locationData;
  } catch (error) {
    console.log(error);
  }
}

// TODO: Create destructureLocationData method
private destructureLocationData(locationData: Coordinates): Coordinates {
  let coordinates: Coordinates = {
    lat: locationData.lat,
    lon: locationData.lon
  }
  return coordinates;
}

// TODO: Create buildGeocodeQuery method
private buildGeocodeQuery(): string {
  return `${this.baseUrl}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
}
  
// TODO: Create buildWeatherQuery method
private buildWeatherQuery(coordinates: Coordinates): string {
  return `${this.baseUrl}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`; 
}
  
// TODO: Create fetchAndDestructureLocationData method
private async fetchAndDestructureLocationData() {
  const query = await this.buildGeocodeQuery();
  const locationData = await this.fetchLocationData(query);
  const data = this.destructureLocationData(locationData[0]);
  return data;
}
  
// TODO: Create fetchWeatherData method.
private async fetchWeatherData(coordinates: Coordinates) {
  const query = await this.buildWeatherQuery(coordinates);
  // console.log(query);
  const data = await this.fetchLocationData(query);
  return data;
}
  
// TODO: Build parseCurrentWeather method
private parseCurrentWeather(response: any) {
  const date = dayjs().format('MM/DD/YYYY');
  let currentWeather = new Weather(response.name, date, response.weather[0].icon, response.weather[0].description, response.main.temp, response.wind.speed, response.main.humidity);
  return currentWeather;
}
  
// TODO: Complete buildForecastArray method
private async buildForecastArray(currentWeather: Weather,_weatherData: any[], coordinates: Coordinates) {
  let forecastQuery = `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;

  // api.openweathermap.org/data/2.5/forecast?lat=42.3315509&lon=-83.0466403&appid=45a12e76ba3a9d625292f4a33bc7d84e&units=imperial
  // return `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`; 
  try {
    let response = await fetch(forecastQuery);
    let weatherData = await response.json();
    console.log('Forecast Weather:', weatherData);
  
    let forecastWeather: Weather[] = [];
    

    for (let i = 0; i < weatherData.list.length ; i+=8) {   
      const dateString = weatherData.list[i].dt_txt;
      const date = new Date(dateString);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      let dailyWeather = new Weather(currentWeather.city, formattedDate, weatherData.list[i].weather[0].icon, weatherData.list[i].weather[0].description, weatherData.list[i].main.temp, weatherData.list[i].wind.speed, weatherData.list[i].main.humidity);
      forecastWeather.push(dailyWeather);
    }
    return forecastWeather;

    // type ForecastItem = {
    //   dateTime: string;
    //   temperature: number;
    //   weatherDescription: string;
    // };
    
    // function extractForecastList(forecastWeather: any): ForecastItem[] {
    //   if (!forecastWeather || !forecastWeather.list) {
    //     throw new Error("Invalid forecast data");
    //   }
    
    //   return forecastWeather.list.map((item: any) => ({
    //     dateTime: item.dt_txt,
    //     temperature: item.main.temp,
    //     weatherDescription: item.weather[0]?.description || "No description",
    //   }));
    // }



    // return [{...currentWeather}];
  } catch (error) {
    console.log(error);
    return error;
  }

}


// TODO: Complete getWeatherForCity method
async getWeatherForCity(city: string) {
  this.cityName = city;
  let coordinates = await this.fetchAndDestructureLocationData();
  let weatherdata = await this.fetchWeatherData(coordinates);
  // console.log(weatherdata);
  let data = this.parseCurrentWeather(weatherdata);
  // console.log('Current Weather:', data);
  // console.log(Weather);
  let forecast = await this.buildForecastArray(data, weatherdata.daily, coordinates);
  return forecast;
}
}
export default new WeatherService();