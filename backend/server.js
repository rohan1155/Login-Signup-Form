const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const router = require("./userRoute");
const cors = require("cors");

const mongoURI = "mongodb://127.0.0.1:27017/t";

app.use(express.json());
app.use(cors());

app.use("/", router);

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello!"));

app.listen(port, () => console.log(`App listening on port ${port}!`));
