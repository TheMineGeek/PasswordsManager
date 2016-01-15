var mongoose = require('mongoose');

var passwordSchema = new mongoose.Schema({
  username: String,
  password: String,
  website: String,
  ownerID: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Password', passwordSchema);