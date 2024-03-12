const express = require("express");
const app = express();
const mongoDB = require("./config/db");
const cors = require("cors");
const user = require("./routes/user");
const invoice = require("./routes/invoice");
require("dotenv").config();
mongoDB();

app.use(cors());

app.options("*", cors());

app.use(
  cors({
    origin: "*",
    methods: ["post", "get", "put", "delete"],
    "Access-Control-Allow-Credentials": true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user/", user);
app.use("/api/v1/invoice/", invoice);

const port = process.env.PORT || 4000;
app.listen(port, console.log("server is running at " + port, "..."));

// Health api
app.get("/health", (req, res) => {
  res.status(200);
  console.log("Health is good");
});

// home page for server
app.get("/", (req, res) => {
  res.status(200).send("<h1>Home</h1>");
});
