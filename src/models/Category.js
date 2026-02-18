const mongoose = require('mongoose');
require('./Menu');

const categorySchema = new mongoose.Schema(
  {
    menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    ordre_affichage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
categorySchema.index({ menu_id: 1 });
categorySchema.index({ ordre_affichage: 1 });

module.exports = mongoose.model('Category', categorySchema);
