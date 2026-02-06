import { Router } from 'express';
import { handleWebhook } from '../controllers/WebhookController';

const router = Router();

router.post('/', handleWebhook);

export default router;