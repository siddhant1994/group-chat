const mongoose = require("mongoose");

let DB_URL = process.env.DATABASE;

module.exports = async () => {
  console.log("connecting to DB...");
  try {
    await mongoose.connect(DB_URL);
    console.log(`DB connection successful!`.blue.bold);
  } catch (error) {
    console.log("DB Connection Failed !");
    console.log(`error`, error);
    throw new Error(error);
  }
};
