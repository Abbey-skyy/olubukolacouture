import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
    isActive:     { type: Boolean, default: true },
    source:       { type: String, enum: ['popup', 'footer', 'checkout', 'manual'], default: 'popup' },
  },
  { timestamps: true }
);

export default mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);
