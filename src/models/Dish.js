const mongoose = require('mongoose');
require('./Category');

const dishSchema = new mongoose.Schema(
  {
    categorie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    prix: {
      type: Number,
      required: true,
      min: 0,
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    image_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
dishSchema.index({ categorie_id: 1 });
dishSchema.index({ disponible: 1 });
dishSchema.index({ nom: 1 });

module.exports = mongoose.model('Dish', dishSchema);
