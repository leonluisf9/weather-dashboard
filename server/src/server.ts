import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static('../client/dist'));

// app.get('*', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
// });

// TODO: Implement middleware for parsing JSON and urlencoded form data
//The `express.json()` middleware attaches incoming json data from requests to the `req.body` property.
app.use(express.json());
//The `express.urlencoded()` middleware works similarly, but for form encoded data.
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
