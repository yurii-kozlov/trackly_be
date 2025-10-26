import dotenv from 'dotenv';
import express from 'express';

dotenv.config({
  path: './.env',
})
console.log('wasssup');

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/test', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
