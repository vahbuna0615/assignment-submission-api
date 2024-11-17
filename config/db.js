const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
  } catch (err) {
    process.env(1)
  }
}

module.exports = connectToDB;