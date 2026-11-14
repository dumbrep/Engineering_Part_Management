import mongoose from 'mongoose';
import config from './config.js';
import { connectDb } from './db.js';
import app from './app.js';

await connectDb();
app.listen(config.port, () => console.log(`API listening on :${config.port}`));
