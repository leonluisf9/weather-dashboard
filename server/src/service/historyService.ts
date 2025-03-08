import { promises as fs } from 'fs';
const filePath = "././db/searchHistory.json";

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: number;
  constructor(
    name: string, 
    id: number)
    {
    this.name = name;
    this.id = id; 
  }
};

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
private async read() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading search History:', error);
    return []; 
  }
}

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
private async write(cities: City[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(cities, null, 2));
  } catch (error) {
    console.error('Error writing search History:', error);
  }
}

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      const history = await this.read();
      const valuesArray = history.map((item: City) => item["name"]); 
      const newCity = new City(city, history.length + 1);
      if (!valuesArray.includes(city)) {
        history.push(newCity);
        await this.write(history);
      } 
      else {
        console.log(`City already exists: ${city}`);
      }
    } catch (error) {
      console.error("Error adding city to history:", error);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
