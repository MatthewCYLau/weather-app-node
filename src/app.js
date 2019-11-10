const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const hbs = require("hbs");
const { geocode, geocode2 } = require("./utils/geocode");
const { forecast, forecast2 } = require("./utils/forecast");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

io.on("connection", socket => {

  console.log("New WebSocket connection");

  socket.on("sendLocation", (crd, callback) => {

    callback();

    const latitude = crd.latitude;
    const longitude = crd.longitude;

    const getForecast = async () => {
      try {
        const forecastResponse = await forecast2(latitude, longitude);

        const forecastData =
        forecastResponse.daily.data[0].summary +
        " It is currently " +
        forecastResponse.currently.temperature +
        " degress out. This high today is " +
        forecastResponse.daily.data[0].temperatureHigh +
        " with a low of " +
        forecastResponse.daily.data[0].temperatureLow +
        ". There is a " +
        forecastResponse.currently.precipProbability +
        "% chance of rain.";

        socket.emit("locationMessage", forecastData);

      } catch (error) {

      }
    };

    getForecast();
  });

  socket.on("join", () => {
    socket.emit("message", "Welcome user!");
  });
});

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Andrew Mead"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Andrew Mead"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Andrew Mead"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!"
    });
  }

  const getForecast = async () => {
    try {
      const geocodeResponse = await geocode2(req.query.address);

      const latitude = geocodeResponse.latitude;
      const longitude = geocodeResponse.longitude;
      const location = geocodeResponse.location;

      const forecastResponse = await forecast2(latitude, longitude);

      const forecastData =
        forecastResponse.daily.data[0].summary +
        " It is currently " +
        forecastResponse.currently.temperature +
        " degress out. This high today is " +
        forecastResponse.daily.data[0].temperatureHigh +
        " with a low of " +
        forecastResponse.daily.data[0].temperatureLow +
        ". There is a " +
        forecastResponse.currently.precipProbability +
        "% chance of rain.";

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      });
    } catch (error) {
      return res.send({
        error
      });
    }
  };

  getForecast();

  // geocode(req.query.address, (error, {
  //     latitude,
  //     longitude,
  //     location
  // } = {}) => {
  //     if (error) {
  //         return res.send({
  //             error
  //         })
  //     }

  //     forecast(latitude, longitude, (error, forecastData) => {
  //         if (error) {
  //             return res.send({
  //                 error
  //             })
  //         }

  //         res.send({
  //             forecast: forecastData,
  //             location,
  //             address: req.query.address
  //         })
  //     })
  // })
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }

  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Help article not found."
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Page not found."
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
