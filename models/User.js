import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  label:      { type: String, default: 'Home' },
  fullName:   String,
  line1:      String,
  line2:      String,
  city:       String,
  postcode:   String,
  country:    { type: String, default: 'GB' },
  phone:      String,
  isDefault:  { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:       { type: String, minlength: 12 },
    role:           { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    emailVerified:  { type: Date, default: null },
    verifyToken:    { type: String },
    verifyTokenExp: { type: Date },
    resetToken:     { type: String },
    resetTokenExp:  { type: Date },
    image:          { type: String },
    addresses:      [addressSchema],
    wishlist:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        size:    { type: String },
        qty:     { type: Number, default: 1 },
      },
    ],
    rememberMe:     { type: Boolean, default: false },
    newsletterSub:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verifyToken;
  delete obj.verifyTokenExp;
  delete obj.resetToken;
  delete obj.resetTokenExp;
  return obj;
};

export default mongoose.models.User || mongoose.model('User', userSchema);
