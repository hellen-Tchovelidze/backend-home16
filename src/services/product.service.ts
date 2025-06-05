import { Product } from '../models/product.model';

export const createProduct = (data: any) => Product.create(data);

export const getAllProducts = () => Product.find();

export const getProductById = (id: string) => Product.findById(id);

export const updateProduct = (id: string, data: any) =>
  Product.findByIdAndUpdate(id, data, { new: true });

export const deleteProduct = (id: string) => Product.findByIdAndDelete(id);
