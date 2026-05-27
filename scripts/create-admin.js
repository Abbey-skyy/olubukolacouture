/**
 * Creates the admin user.
 * Run once with: node scripts/create-admin.js
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set in .env.local'); process.exit(1); }

const userSchema = new mongoose.Schema({
  name:          String,
  email:         String,
  password:      String,
  role:          String,
  emailVerified: Date,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  const email    = 'newabby59@gmail.com';
  const existing = await User.findOne({ email });

  if (existing) {
    // Update to ADMIN role and reset password
    const hashed = await bcrypt.hash('Keith12345@@', 12);
    await User.findOneAndUpdate({ email }, {
      role:          'ADMIN',
      password:      hashed,
      emailVerified: new Date(),
    });
    console.log(`✓ Admin account updated for: ${email}`);
  } else {
    const hashed = await bcrypt.hash('Keith12345@@', 12);
    await User.create({
      name:          'Admin',
      email,
      password:      hashed,
      role:          'ADMIN',
      emailVerified: new Date(),
    });
    console.log(`✓ Admin account created: ${email}`);
  }

  console.log('  Email:    newabby59@gmail.com');
  console.log('  Password: Keith12345@@');
  await mongoose.disconnect();
  console.log('\n✅ Done! You can now log in at /login');
}

createAdmin().catch((err) => { console.error('❌ Error:', err.message); process.exit(1); });
