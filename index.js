require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const isURL = require("is-url");

// Basic Configuration
const port = process.env.PORT || 3000;
const urls = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  if (!isURL(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  const urlItem = urls.find(({ url }) => url === originalUrl);
  if (urlItem) {
    return res.json({ original_url: originalUrl, short_url: urlItem.id });
  }

  const newId = urls.length + 1;
  urls.push({
    url: originalUrl,
    id: newId,
  });
  return res.json({ original_url: originalUrl, short_url: newId });
});

app.use("/api/shorturl/:urlId", function (req, res) {
  const urlItem = urls.find(({ id }) => id === +req.params.urlId);
  return res.redirect(urlItem?.url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
