
import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { validateRequest } from '../middlewares/validateRequest';
import { isAdmin } from '../middlewares/isAdmin';
import { productSchema } from '../validations/product.validation';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../services/product.service';

import { Product } from '../models/product.model';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


// router.get('/', async (req: Request, res: Response) => {
//   const products = await getAllProducts();
//   res.json(products);
// });


router.get('/:id', async (req: Request, res: Response) => {
  
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});



router.post('/:id/review', async (req: Request, res: Response) => {
  console.log("shemovidaaaa");
  
  const { rating, comment} =req.body
 const email = req.headers['email'] as string;

 if(!email){
  res.status(400).json({ error: 'Email is required' });
 }

 if (!rating || !comment) {
  return res.status(400).json({ error: 'Rating and comment are required' });
  
 }

 if (typeof rating !== 'number' || rating< 1 || rating > 5) {
  return res.status(400).json({ error: 'Invalid rating or comment format' });
  
 }
 try {
  const review = { email, rating, comment };

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { reviews: review } },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(201).json({ message: 'Review added successfully', reviews: updatedProduct.reviews });
} catch (error) {
  res.status(500).json({ error: 'Internal server error' });
}

})




router.post(
  '/',
  upload.single('photo'),
  validateRequest(productSchema),
  async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File | undefined;
    let photoUrl = '';

    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      photoUrl = result.secure_url;
    }

    const product = await createProduct({ ...req.body, photo: photoUrl });
    res.status(201).json(product);
  }
);


router.put(
  '/:id',
  isAdmin,
  validateRequest(productSchema),
  async (req: Request, res: Response) => {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  }
);


router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  const deleted = await deleteProduct(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
});





router.get('/', async (req: Request, res: Response) => {

try {
  const {category, price, page= '1', limit= '30', search}= req.query;
  const filter: any = {};
  if (category) {
    filter.category = { $regex: category }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search} },
      { description: { $regex: search } }
    ];
  }
  let sort : any = {};
  if (price === 'asc') {
    sort.price = 1;
  } else if (price === 'desc') {
    sort.price = -1;
  }


  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = Math.min(parseInt(limit as string, 10) || 30);
  const skip = (pageNumber - 1) * limitNumber;

  const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      products,
    });


} catch (error) {
  res.status(500).json({ error: 'Internal server error' });
}
 
})



export default router;
