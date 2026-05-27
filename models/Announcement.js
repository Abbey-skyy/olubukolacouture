import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    messages: [{ type: String, required: true }],
    enabled:  { type: Boolean, default: true },
    speed:    { type: Number,  default: 18 },   // marquee duration in seconds
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
