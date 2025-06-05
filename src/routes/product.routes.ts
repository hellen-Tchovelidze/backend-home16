
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

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.get('/', async (req: Request, res: Response) => {
  const products = await getAllProducts();
  res.json(products);
});


router.get('/:id', async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});


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

export default router;
