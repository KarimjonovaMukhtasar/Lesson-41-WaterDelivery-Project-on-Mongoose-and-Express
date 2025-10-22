import express from 'express';
import errorHandler from './src/config/middleWare.js';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import MainRouter from './src/routes/index.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use('/', MainRouter);
app.use(errorHandler);

async function bootstrap() {
  try {
    await mongoose.connect('mongodb://localhost:217017');
    console.log(`CONNECTED T0 DATABASE SUCCESSFULLY!`);
    app.listen(PORT, () => {
      console.log(`SERVER IS RUNNING SUCCESSFULLY ON PORT ${PORT}`);
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send(`ERROR WHILE CONNECTING TO DATABASE!`);
  }
}

bootstrap();
