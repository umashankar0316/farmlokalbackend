import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const cursor = parseInt(req.query.cursor as string) || 0;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';

    const products = await ProductService.getProducts(cursor, limit, search);
    
    // Calculate next cursor
    const lastProduct = products[products.length - 1];
    const nextCursor = lastProduct ? lastProduct.id : null;

    res.json({ 
      data: products, 
      pagination: {
        nextCursor,
        limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};