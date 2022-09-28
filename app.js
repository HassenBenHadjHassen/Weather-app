require('dotenv').config()
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", function (req,res) {
    res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req,res) { 
    const query = req.body.city;
    const appid = process.env.APPID;
    const units = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + appid;

    https.get(url, function (response) {

        response.on("data", function (d) {
            const weatherData = JSON.parse(d);
            const temp = weatherData.main.temp;
            const weather_desc = weatherData.weather[0].description;
            const iconCode = weatherData.weather[0].icon;

            var weatherIconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"

            res.write("<h1>The temperature in " + query + " is " + Math.round(temp) + " degrees Celcius.</h1>");
            res.write("<h2>The weather currently have "  + weather_desc + ".</h2>")  
            res.write("<img src=" + weatherIconUrl + " alt=" + "weather image" + ">")

            res.send()
        })
    })
});

var port = process.env.PORT;
if (port === "" || port === null) {
    port = 5500;
}


app.listen(port, function () {
    console.log("Server Started on Port", port);
});