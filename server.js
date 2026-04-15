import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stkPushHandler from './api/stk-push.js';
import paymentStatusHandler from './api/payment-status.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Helper to mock Vercel req/res
const mockVercel = (handler) => async (req, res) => {
  const mockRes = {
    status: (code) => ({
      json: (data) => res.status(code).json(data)
    })
  };
  await handler(req, mockRes);
};

app.post('/api/stk-push', mockVercel(stkPushHandler));
app.get('/api/payment-status', mockVercel(paymentStatusHandler));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local API server running on http://localhost:${PORT}`);
});
