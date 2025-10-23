import express from 'express';
import {errorHandler} from './src/middleware/errorHandler.js';
import {dbconnect}  from "./src/db/index.js"
import {config} from "./src/config/index.js"
import morgan from 'morgan';
import dotenv from 'dotenv';
import MainRouter from './src/routers/index.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use('/', MainRouter);
app.use(errorHandler);

async function bootstrap() {
  try {
    // await mongoose.connect('mongodb://localhost:27017/waterDelivery');
    await dbconnect()
    console.log(`CONNECTED T0 DATABASE SUCCESSFULLY!`);
    app.listen(config.app.port, () => {
      console.log(`SERVER IS RUNNING SUCCESSFULLY ON PORT ${config.app.port}`);
    });
  } catch (e) {
    console.error(e.message);
  }
}

bootstrap();
