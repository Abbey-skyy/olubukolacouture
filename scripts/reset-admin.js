/**
 * Reset the admin password directly in the database.
 *
 * Usage:
 *   node scripts/reset-admin.js <new-password>
 *
 * Example:
 *   node scripts/reset-admin.js MyNewPass@2024
 *
 * Requirements: password must be at least 12 characters.
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const path     = require('path');

// Load .env.local
require('fs').readFileSync(path.join(__dirname, '../.env.local'), 'utf8')
  .split('\n')
  .forEach((line) => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  });

const ADMIN_EMAIL = 'newabby59@gmail.com';
const newPassword = process.argv[2];

if (!newPassword) {
  console.error('Usage: node scripts/reset-admin.js <new-password>');
  process.exit(1);
}

if (newPassword.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const schema = new mongoose.Schema(
  { name: String, email: String, password: String, role: String, emailVerified: Date },
  { strict: false }
);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const User   = mongoose.models.User || mongoose.model('User', schema);
  const hashed = await bcrypt.hash(newPassword, 12);

  const updated = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { $set: { password: hashed, role: 'ADMIN', emailVerified: new Date() } },
    { new: true }
  ).lean();

  if (updated) {
    console.log(`✓ Admin password updated for: ${updated.email}`);
    console.log(`  Role: ${updated.role}`);
    console.log(`  You can now log in at /login with this email and your new password.`);
  } else {
    console.error(`✗ No user found with email: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
}

run().catch((e) => { console.error(e.message); process.exit(1); });
