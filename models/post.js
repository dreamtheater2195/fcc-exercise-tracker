const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  _userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number, 
    required: true,
    default: 5
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model(
  'Post', 
  PostSchema
);

module.exports = {Post} ;