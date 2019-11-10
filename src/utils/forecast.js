const request = require("request");
const rp = require("request-promise");

const forecast = (latitude, longitude, callback) => {
  const url =
    "https://api.darksky.net/forecast/"+process.env.DARKSKY_API_KEY+"/" +
    latitude +
    "," +
    longitude;

  request(
    {
      url,
      json: true
    },
    (error, { body }) => {
      if (error) {
        callback("Unable to connect to weather service!", undefined);
      } else if (body.error) {
        callback("Unable to find location", undefined);
      } else {
        callback(
          undefined,
          body.daily.data[0].summary +
            " It is currently " +
            body.currently.temperature +
            " degress out. This high today is " +
            body.daily.data[0].temperatureHigh +
            " with a low of " +
            body.daily.data[0].temperatureLow +
            ". There is a " +
            body.currently.precipProbability +
            "% chance of rain."
        );
      }
    }
  );
};

const forecast2 = async (latitude, longitude) => {
  const url =
    "https://api.darksky.net/forecast/"+process.env.DARKSKY_API_KEY+"/" +
    latitude +
    "," +
    longitude;

  const options = {
    method: `GET`,
    json: true,
    uri: url
  };

  try {
    const response = await rp(options);
    return Promise.resolve(response);
  } catch (error) {
    Promise.reject(error);
  }
};

module.exports = {
  forecast,
  forecast2
};
