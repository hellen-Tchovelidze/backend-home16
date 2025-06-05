import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectToDb';
import productRoutes from './routes/product.routes';

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(4090, () => {
    console.log(`🚀 Server running on http://localhost:4090`);
  });
};

startServer();
