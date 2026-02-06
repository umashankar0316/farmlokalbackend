import { Request, Response } from 'express';
import { ExternalApiService } from '../services/ExternalApiService';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { event_id, data } = req.body;

    if (!event_id) {
      res.status(400).json({ error: 'Missing event_id' });
      return;
    }

    const result = await ExternalApiService.handleWebhook(event_id, data);
    res.status(200).json(result);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};