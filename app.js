const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

require("./config/database");

require("./models/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(require("./routes"));

app.listen(3000);
