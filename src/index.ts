import app from '#app.js';
import connectDB from '#db/index.js';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
})

const PORT = process.env.PORT ?? 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The server is running on port: ${PORT as string}`);
    });
  })
  .catch((error: unknown) => {
    console.error('MongoDB connection error', error);
    process.exit(1);
  })
