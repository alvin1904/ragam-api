const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const root_dir = __dirname.split('src')[0];
dotenv.config({ path: path.join(root_dir, `.env`) });
const { connectDb } = require('./config/db');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

app.use(morgan('dev'));

//routes

const userRoute = require('./routes/userAuthRoute');
const artistRoute = require('./routes/artistAuthRoute');
const genreRoute = require('./routes/genreRoute');
const languageRoute = require('./routes/languageRoute');
const albumRoute = require('./routes/albumRoute');
const songRoute = require('./routes/musicRoute');
const playListRoute = require('./routes/playListRoute');
const searchRoute = require('./routes/searchRoute');
const userServiceRoute = require('./routes/userServiceRoute');
const artistServiceRoute = require('./routes/artistServiceRoute');

//error handler
const errorHandler = require('./error/err');
const pageNotFound = require('./middleware/pageNotFound');
const multerError = require('./error/multerError');

//middleware
const cors = require('cors');

app.use(xss());
app.use(helmet());
app.use(cors());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(express.static('./public'));

app.get('/api/v1/live', (req, res) => {
  return res.status(200).json({ message: 'alive' });
});

const start = async () => {
  try {
    const connect = connectDb(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
};

start();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`http://127.0.0.1:${port}`));

app.use('/api/v1/user', userRoute);
app.use('/api/v1/artist', artistRoute);
app.use('/api/v1/genres', genreRoute);
app.use('/api/v1/languages', languageRoute);
app.use('/api/v1/albums', albumRoute);
app.use('/api/v1/songs', songRoute);
app.use('/api/v1/playlists', playListRoute);
app.use('/api/v1/search', searchRoute);
app.use('/api/v1/user-services', userServiceRoute);
app.use('/api/v1/artist-services', artistServiceRoute);

app.use(multerError);
app.use(errorHandler);
app.use(pageNotFound);
