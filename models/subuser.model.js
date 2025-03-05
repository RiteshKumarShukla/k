const mongoose = require('mongoose');

const subUserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  userRole: { type: String, required: true }
});

const SubUser = mongoose.model('subuser', subUserSchema);

module.exports = SubUser;
