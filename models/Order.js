import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  image:    { type: String },
  size:     { type: String },
  qty:      { type: Number, required: true, min: 1 },
  priceGBP: { type: Number, required: true },  // price in pence at time of order
});

const orderSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items:    [orderItemSchema],
    shipping: {
      fullName: String,
      line1:    String,
      line2:    String,
      city:     String,
      postcode: String,
      country:  String,
      phone:    String,
    },
    currency:     { type: String, enum: ['gbp', 'ngn'], default: 'gbp' },
    subtotalGBP:  { type: Number, required: true },  // pence
    shippingGBP:  { type: Number, default: 0 },
    totalGBP:     { type: Number, required: true },
    exchangeRate: { type: Number },                  // rate at time of purchase if NGN

    payment: {
      provider:   { type: String, enum: ['stripe', 'paystack'] },
      intentId:   { type: String },
      reference:  { type: String },
      status:     { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
      paidAt:     { type: Date },
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested', 'returned'],
      default: 'pending',
    },
    trackingNumber: { type: String },
    notes:          { type: String },
    returnReason:   { type: String },
    returnedAt:     { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
