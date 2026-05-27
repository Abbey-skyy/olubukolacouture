import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category:    {
      type: String,
      required: true,
      enum: [
        'dresses', 'tops', 'trousers', 'skirts', '2-piece', 'lingerie', 'auto-gele',
        'beads', 'zips', 'rhinestones', 'applique-sequins',
        // legacy
        'jackets', 'accessories', 'knitwear', 'swimwear',
      ],
    },
    subcategory: { type: String },
    priceGBP:    { type: Number, required: true },          // Store in pence (e.g. 5999 = £59.99)
    compareAtGBP:{ type: Number },                          // Original price for sale badge
    sizes: [
      {
        label:     { type: String },                        // 'XS','S','M','L','XL'
        stock:     { type: Number, default: 0 },
      },
    ],
    images: [
      {
        url:      { type: String, required: true },
        publicId: { type: String },                        // Cloudinary public_id
        alt:      { type: String },
        order:    { type: Number, default: 0 },
      },
    ],
    colors: [
      {
        name:   { type: String },
        hex:    { type: String },
        images: [
          {
            url:      { type: String, required: true },
            publicId: { type: String },
            alt:      { type: String },
            order:    { type: Number, default: 0 },
          },
        ],
        sizes: [
          {
            label: { type: String },
            stock: { type: Number, default: 0 },
          },
        ],
      },
    ],
    tags:        [{ type: String }],
    isFeatured:  { type: Boolean, default: false },
    isNewArrival:{ type: Boolean, default: false },
    isSale:      { type: Boolean, default: false },
    isArchived:  { type: Boolean, default: false },        // Soft-delete
    rating:      { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    soldCount:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isArchived: 1 });
productSchema.index({ isFeatured: 1 });

// In development, HMR re-evaluates this module but mongoose.models.Product
// remains cached with the old schema. Delete it so the new schema is always used.
if (process.env.NODE_ENV !== 'production' && mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model('Product', productSchema);
