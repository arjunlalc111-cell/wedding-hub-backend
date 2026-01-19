// models/User.js (for admin users)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
