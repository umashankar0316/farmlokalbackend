import { db } from '../config/database';

export class ProductService {
  static async getProducts(cursor: any, limit: any) {
    // 1. Force inputs to be Numbers (Fixes the crash)
    const cursorNum = Number(cursor) || 0;
    const limitNum = Number(limit) || 10;

    const query = `
      SELECT id, name, description, price 
      FROM products 
      WHERE id > ? 
      ORDER BY id ASC 
      LIMIT ?
    `;

    // 2. Use ': any' to silence the "red line" TypeScript errors
    const [rows]: any = await db.execute(query, [cursorNum, limitNum]);
    
    return {
      data: rows,
      nextCursor: rows.length > 0 ? rows[rows.length - 1].id : null
    };
  }
}