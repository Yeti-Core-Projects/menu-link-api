const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    numero: {
      type: Number,
      required: true,
      unique: true,
    },
    qr_code: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
  }
);

// Index for faster queries
tableSchema.index({ numero: 1 });
tableSchema.index({ qr_code: 1 });

module.exports = mongoose.model('Table', tableSchema);
