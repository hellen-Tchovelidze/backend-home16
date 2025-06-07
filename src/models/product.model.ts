import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  photo: String,
  category: String,
  reviews: [reviewSchema],

}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
