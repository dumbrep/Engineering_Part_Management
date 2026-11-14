import mongoose from 'mongoose';
import config from '../config.js';
import { connectDb } from '../db.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/credentials.js';

const { name, loginId, password } = config.admin;
if (!loginId || !password) throw new Error('Set ADMIN_LOGIN_ID and ADMIN_PASSWORD in .env');

await connectDb();
console.log(`Seeding database "${mongoose.connection.name}" on ${mongoose.connection.host}`);

if (await User.exists({ role: 'admin' })) {
  console.log('Admin already exists - nothing to do.');
} else {
  await User.create({ name, loginId, passwordHash: await hashPassword(password), role: 'admin' });
  console.log(`Admin created. Login ID: ${loginId}`);
}

await mongoose.disconnect();
