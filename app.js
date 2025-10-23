import express from 'express';
import {errorHandler} from './src/middleware/errorHandler.js';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import MainRouter from './src/routers/index.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use('/', MainRouter);
app.use(errorHandler);

async function bootstrap() {
  try {
    await mongoose.connect('mongodb://localhost:27017/waterDelivery');
    console.log(`CONNECTED T0 DATABASE SUCCESSFULLY!`);
    app.listen(PORT, () => {
      console.log(`SERVER IS RUNNING SUCCESSFULLY ON PORT ${PORT}`);
    });
  } catch (e) {
    console.error(e.message);
  }
}

bootstrap();
