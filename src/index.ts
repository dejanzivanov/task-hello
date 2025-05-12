import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('<h1>Hello World</h1>');
});

// ← Add this listener block!
app.listen(PORT, () => {
  console.log(`🚀 Listening on http://localhost:${PORT}`);
});

