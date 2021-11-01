const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  userId: String,
  name: String,
  queue: Array,
});

module.exports = mongoose.model('user-playlists', playlistSchema, 'user-playlists');