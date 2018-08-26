var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
.then(() => console.log("Connected to mongodb server"))
.catch((err) => console.log("Cannot connect to mongodb server"));
      
module.exports = { mongoose };