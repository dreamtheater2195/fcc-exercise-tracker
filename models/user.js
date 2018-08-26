const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, 
    trim: true,
    minlength: 6,
    maxlength: 20,
    unique: true
  },
  _id: {
    type: String,
    required: true
  }
});

const User = mongoose.model(
  'User', 
  UserSchema
);

module.exports = {User} ;