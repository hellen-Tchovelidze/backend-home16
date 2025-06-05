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


router.get('/', async (req:Request , res:Response) => { 
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




export default router;
