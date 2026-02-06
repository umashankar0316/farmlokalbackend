import { db } from '../config/database';

export class ProductService {
  static async getProducts(cursor: any, limit: any) {
    // 1. Force inputs to be Numbers 
    const cursorNum = Number(cursor) || 0;
    const limitNum = Number(limit) || 10;

    // 2. Insert numbers directly into the query string
    // This bypasses the "Incorrect arguments" error completely.
    const query = `
      SELECT id, name, description, price 
      FROM products 
      WHERE id > ${cursorNum} 
      ORDER BY id ASC 
      LIMIT ${limitNum}
    `;

    // 3. Run query without the [params] array
    const [rows]: any = await db.execute(query);
    
    return {
      data: rows,
      nextCursor: rows.length > 0 ? rows[rows.length - 1].id : null
    };
  }
}