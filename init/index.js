const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const sampleData = require("./data.js");

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function initDb() {
  await Listing.deleteMany({});
  sampleData.data = sampleData.data.map((obj) => ({
    ...obj,
    owner: "65fc583b39af197ccc07ff62",
  }));
  await Listing.insertMany(sampleData.data);
  console.log("Data was initialized");
}

initDb();
