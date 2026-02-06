import axios from 'axios';
import { withRetry } from '../utils/Retry';
import { circuitBreaker } from '../utils/CircuitBreaker';
import { db } from '../config/database';

export class ExternalApiService {
  // Sync API with Timeout, Retry & Circuit Breaker
  static async fetchSyncData() {
    return circuitBreaker.execute(async () => {
      return withRetry(async () => {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1', { timeout: 5000 });
        return response.data;
      });
    });
  }

  // Idempotent Webhook Handler
  static async handleWebhook(eventId: string, payload: any) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Idempotency check
      const [rows]: any = await connection.execute(
        'SELECT event_id FROM processed_events WHERE event_id = ?', 
        [eventId]
      );
      
      if (rows.length > 0) {
        console.log(`Event ${eventId} already processed.`);
        await connection.commit();
        return { status: 'already_processed' };
      }

      // Process event...
      await connection.execute(
        'INSERT INTO processed_events (event_id, data) VALUES (?, ?)',
        [eventId, JSON.stringify(payload)]
      );

      await connection.commit();
      return { status: 'success' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}