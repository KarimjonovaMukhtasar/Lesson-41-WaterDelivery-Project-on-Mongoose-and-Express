import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { dbconnect } from './db/index.js';
import { config } from './config/index.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
import MainRouter from './routers/index.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use('/', MainRouter);
app.use(errorHandler);

async function bootstrap() {
  try {
    // await mongoose.connect('mongodb://localhost:27017/waterDelivery');
    await dbconnect();
    app.listen(config.app.port, () => {
      console.log(`SERVER IS RUNNING SUCCESSFULLY ON PORT ${config.app.port}`);
    });
  } catch (e) {
    console.error(e.message);
  }
}

bootstrap();
