const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middlewares/error');
const fileUpload = require('express-fileupload');
const path = require('path');

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
const bootcamps = require('./routes/bootcamp');
const courses = require('./routes/course');

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses/', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5600;
// console.log(process.env);

const server = app.listen(PORT, () => {
  console.log(
    `Server running in  ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  );
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});
