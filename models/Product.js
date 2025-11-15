const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  sku: { type: String },
  description: { type: String },
  purity: { type: String },
  weight: { type: Number },
  pricePerGram: { type: Number },
  images: [imageSchema],
  category: { type: String },
  occasion: { type: String },
  material: { type: String },
  weddingType: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Generate slug from title before saving
productSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    // Generate slug from title
    let slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove hyphens from start and end
    
    // Add SKU to slug if available to ensure uniqueness
    if (this.sku) {
      slug = `${slug}-${this.sku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    } else {
      // If no SKU, add a random suffix to ensure uniqueness
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      slug = `${slug}-${randomSuffix}`;
    }
    
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
