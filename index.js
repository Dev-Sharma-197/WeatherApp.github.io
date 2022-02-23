// Importing Modules
const express = require("express");
const path = require("path");
const requests = require("requests");

// Generating Dynamic port
const port = process.env.PORT || 8000

// Creating app
const app = express();

// Serving Static files
app.use("/public", express.static(path.join(__dirname + "/public")));

// Setting view engine as pug
app.set("view engine", "pug");

// setting default city
let city = "Kurukshetra";

// Making route (endpoint)
app.get("/", (req, res) => {
  // Handling Error which creates by empty input
  if (req.query.input) {
    console.log(req.query.input + "---------------");
    city = req.query.input;
  } else {
    console.log("null-----------------");
  }

  // Streaming data which comes from api (fetching api)
  requests(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9d86aab0609abd49dd5faa394c089ebc`
  )
    // Storing data api data in variable
    .on("data", (chunk) => {
      const apiData = [JSON.parse(chunk)];
      try {
        // Creating dynamic varibles and rendering with pug template
        res.status(200).render("index.pug", {
          location: apiData[0].name,
          country: apiData[0].sys.country,
          tempval: apiData[0].main.temp,
          tempmin: apiData[0].main.temp_min,
          tempmax: apiData[0].main.temp_max,
          tempStatus: apiData[0].weather[0].main,
        });
      } catch (error) {
        // Handling error
        console.log("error");
        res.status(200).render("index.pug", {
          msg: "**Not on this Planet**",
        });
      }
    })
    .on("end", (err) => {
      if (err) return console.log("connection closed due to api error", err);
      res.end();
      console.log("end");
    });
});

// Creating Default Route
app.use((req, res) => {
  res.status(404).json({
    error: "bad request",
  });
});

// Creating Server and listining on localhost
app.listen(port, () => {
  console.log("server is running...");
});
