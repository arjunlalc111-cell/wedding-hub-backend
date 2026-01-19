// User model for Wedding Hub platform
// Supports: user, vendor, admin login (multi-role), favorites, bookings, profile info

import mongoose from "mongoose"; // ✅ Use import for ESM!

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },                        // Full name
  username: { type: String, unique: true, trim: true },      // Username or email (unique)
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },

  passwordHash: { type: String },                            // Hashed password

  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' }, // Multi-role login

  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],       // Favorite vendors
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],       // Bookings (future extension)

  // Profile Info
  avatar: { type: String },                                  // Image URL
  address: { type: String, trim: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt timestamp pre-save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

UserSchema.index({ username: 1, email: 1, phone: 1 });

const User = mongoose.model('User', UserSchema);
export default User; // ✅ ESM export default
