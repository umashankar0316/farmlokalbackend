import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export const getProducts = async (req: Request, res: Response) => {
  try {
    // 1. Clean Inputs: Ensure they are numbers right away
    const cursor = req.query.cursor ? Number(req.query.cursor) : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    // 2. Call Service
    // The service returns { data: [...], nextCursor: 5 }
    const result = await ProductService.getProducts(cursor, limit);

    // 3. Send response directly
    // We don't need to calculate nextCursor here because the Service already did it!
    res.json(result);

  } catch (error) {
    console.error("❌ Controller Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};