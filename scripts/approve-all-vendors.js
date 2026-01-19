#!/usr/bin/env node
// scripts/approve-all-vendors.js
// Approves all vendors that are not approved or rejected.
// Usage (from backend root): node scripts/approve-all-vendors.js
//
// NOTE:
// - Make sure you have a .env file in backend root with MONGO_URI set.
// - This script will mark vendors approved: true where approved=false and rejected=false.

const mongoose = require('mongoose');
const path = require('path');

// load env from backend root
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Vendor = require('../models/vendors');

async function run() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('ERROR: MONGO_URI not set. Please add MONGO_URI to .env in the backend root.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    // Connect with default options (modern mongoose will warn if options unnecessary)
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const filter = { approved: false, rejected: false };
    const update = { $set: { approved: true, rejected: false } };

    const result = await Vendor.updateMany(filter, update);
    // result.modifiedCount for modern mongoose, fallback to nModified
    const modified = result.modifiedCount ?? result.nModified ?? result.n ?? 0;

    console.log(`Vendors updated (approved): ${modified}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error while approving vendors:', err);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(2);
  }
}

run();
