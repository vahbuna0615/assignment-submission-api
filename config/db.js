const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.log(err)
    process.env(1)
  }
}

module.exports = connectToDB;