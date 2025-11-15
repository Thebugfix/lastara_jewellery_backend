const mongoose = require("mongoose");

const heroVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Hero Video",
      trim: true,
    },
    video: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🟡 Static method — returns the latest active video
heroVideoSchema.statics.getActiveVideo = async function () {
  return this.findOne({ isActive: true }).sort({ updatedAt: -1 });
};

// 🟢 Pre-save hook — ensures only one active video at a time
heroVideoSchema.pre("save", async function (next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model("HeroVideo", heroVideoSchema);
