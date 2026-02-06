import { db } from '../config/database';
import { redis } from '../config/redis';
import { RowDataPacket } from 'mysql2';

export class ProductService {
  static async getProducts(cursor: number, limit: number, search: string) {
    const cacheKey = `products:${cursor}:${limit}:${search}`;
    
    // 1. Check Cache
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 2. Build Query
    let query = 'SELECT id, name, description, price FROM products WHERE id > ?';
    const params: (string | number)[] = [cursor];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY id ASC LIMIT ?';
    params.push(limit);

    // Execute Query
    // Type casting helps TS understand the result format
    const [rows] = await db.execute<RowDataPacket[]>(query, params);

    // 3. Set Cache (TTL 60s)
    if (rows.length > 0) {
        await redis.set(cacheKey, JSON.stringify(rows), 'EX', 60);
    }

    return rows;
  }
}