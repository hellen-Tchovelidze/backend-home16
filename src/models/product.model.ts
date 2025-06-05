import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  photo: String,
  category: String,
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
