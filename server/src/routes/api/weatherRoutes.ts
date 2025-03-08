import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  let weatherData = await WeatherService.getWeatherForCity(req.body.cityName);
  // TODO: save city to search history
  await HistoryService.addCity(req.body.cityName);  
  res.send(weatherData);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  let cityHistory = await HistoryService.getCities();
  res.send(cityHistory);
  // res.send('GET request to the homepage');
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, res: Response) => {
  res.send('DELETE request to the homepage');
});

export default router;
