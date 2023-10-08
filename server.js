const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = express();

const PORT = process.env.PORT || 5600;
console.log(process.env);

app.listen(PORT, () => {
  console.log(`Server running in  ${process.env.NODE_ENV} on port ${PORT}`);
});
