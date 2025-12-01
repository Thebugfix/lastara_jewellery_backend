const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String
});

function calculateTotalPrice(product) {
  const gross = product.weight || 0;
  const stoneWeight = product.stoneWeight || 0;
  const rate = product.pricePerGram || 0;
  const stonePriceAmount = product.stonePrice || 0;

  const mc = product.makingCharges || {
    percentage: 20,
    isDiscount: false,
    discountPercentage: 0
  };

  const taxRate = product.taxRate || 0;

  // NET WEIGHT
  const netWeight = gross - stoneWeight;

  // METAL PRICE
  const metalPrice = netWeight * rate;

  // MAKING CHARGES
  const makingAmount = (metalPrice * mc.percentage) / 100;
  const makingDiscount = mc.isDiscount
    ? (makingAmount * mc.discountPercentage) / 100
    : 0;

  const finalMaking = makingAmount - makingDiscount;

  // SUBTOTAL
  const subtotal = metalPrice + stonePriceAmount + finalMaking;

  // TAX
  const taxAmount = (subtotal * taxRate) / 100;

  // FINAL PRICE
  return Number((subtotal + taxAmount).toFixed(2));
}

// PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  sku: { type: String },
  description: { type: String },
  purity: { type: String },
  weight: { type: Number },
  stoneWeight: { type: Number },
  pricePerGram: { type: Number },
  stonePrice: { type: Number },
  makingCharges: {
    percentage: { type: Number, default: 20 },
    isDiscount: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0 }
  },
  taxRate: { type: Number, default: 3 },
  totalPrice: { type: Number },
  images: [imageSchema],
  category: { type: String },
  occasion: { type: String },
  material: { type: String },
  weddingType: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// PRE-SAVE: SLUG + PRICE CALC
productSchema.pre("save", function (next) {
  // SLUG GENERATION
  if (this.isModified("title") || this.isNew) {
    let slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (this.sku) {
      slug = `${slug}-${this.sku.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    } else {
      slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    this.slug = slug;
  }

  // ALWAYS RECALCULATE PRICE
  this.totalPrice = calculateTotalPrice(this);
  next();
});

module.exports = mongoose.model("Product", productSchema);
