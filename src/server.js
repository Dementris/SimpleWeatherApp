import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import { resolve } from "path";
import { fileURLToPath } from "url";
import request from "request";

const app = express();
const PORT = process.env.PORT || 3000;
let location = undefined;

const __dirname = resolve(fileURLToPath(import.meta.url));
const viewsPath = resolve(__dirname, "../views");
const apiKey = `${process.env.WEATHER_API_KEY}`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render(resolve(viewsPath, "index.pug"));
});

app.post("/weather", (req, res) => {
  location = req.body;
  res.redirect("/weather");
});

app.get("/weather/:city?", (req, res) => {
  const city = req.params["city"];
  let geocoding_url;
  if (city) {
    geocoding_url = `https://api.openweathermap.org/data/2.5/weather?q=${city},UA&appid=${apiKey}&units=metric`;
  } else {
    if (!location) {
      res.status(400);
      res.render(resolve(viewsPath, "error.pug"), {
        message: "Bad Request: Error location undefined",
        statusCode: res.statusCode,
      });
      return;
    } else {
      geocoding_url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`;
    }
  }
  request(geocoding_url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let apiWeather = JSON.parse(body);
      if (apiWeather.main === undefined) {
        res.render(resolve(viewsPath, "error.pug"), {
          message: "Bad Request: Error location undefined",
          statusCode: res.statusCode,
        });
      } else {
        res.render(resolve(viewsPath, "weather.pug"), {
          city: apiWeather.name,
          temp: apiWeather.main.temp,
          description: apiWeather.weather[0].description,
          icon: apiWeather.weather[0].icon,
          pressure: apiWeather.main.pressure,
          humidity: apiWeather.main.humidity,
        });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port 3000!");
});
