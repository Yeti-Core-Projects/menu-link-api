const mongoose = require('mongoose');
require('./User');

const menuSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    actif: {
      type: Boolean,
      default: true,
    },
    gestionnaire_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
menuSchema.index({ gestionnaire_id: 1 });
menuSchema.index({ actif: 1 });

module.exports = mongoose.model('Menu', menuSchema);
