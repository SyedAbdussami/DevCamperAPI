const NodeGeoCoder = require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  // fetch: customFetchImplementation,
  apiKey: process.env.GEOCODER_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null,
};

module.exports = NodeGeoCoder(options);
