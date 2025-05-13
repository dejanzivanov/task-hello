// src/index.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();

// Types for webhook payload
interface WebhookPayload {
  address: string;
  tokenSymbol: string;
  amount: string;
  transactionHash: string;
}

// --- Task 1: Webhook endpoint ---
app.post(
  '/webhook',
  express.json(),
  (req: Request, res: Response) => {
    const event = req.body as WebhookPayload;
    const SOLANA_ADDR = process.env.SOLANA_ADDR!;

    if (
      event.address     === SOLANA_ADDR &&
      event.tokenSymbol === 'USDC' &&
      event.amount      === '0.01'
    ) {
      console.log(`✅ Received 0.01 USDC! TX: ${event.transactionHash}`);
    }

    res.status(200).send('OK');
  }
);

// --- Task 2: Query endpoint ---
app.get('/tx/:hash', async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;
    const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY!;
    const RPC_URL     = `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

    // JSON-RPC call
    const rpcBody = {
      jsonrpc: '2.0',
      id:       1,
      method:   'getTransaction',
      params:   [hash, { encoding: 'jsonParsed' }]
    };
    const { data } = await axios.post(RPC_URL, rpcBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    const tx = data.result;
    const balances = tx?.meta?.postTokenBalances || [];
    const usdcBal = balances
      .find((b: any) => b.mint === 'Es9vMFrzaCERZtSmbdF2PaBxNx9x9E9dHxi14FBt5oQ')
      ?.uiTokenAmount.uiAmount ?? 0;

    console.log(`🔍 Queried TX ${hash}: USDC=${usdcBal}`);
    res.json({ hash, usdcAmount: usdcBal, raw: tx });
  } catch (err: any) {
    console.error('❌ Query error:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Optional Hello-World
app.get('/', (_req, res) => {
  res.send('<h1>Hello World</h1>');
});

// Start server
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Service running on http://localhost:${PORT}`);
});
