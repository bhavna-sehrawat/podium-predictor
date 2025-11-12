import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


import User from './model/user.model.js';
import Race from './model/race.model.js';
import Prediction from './model/prediction.model.js';
import Result from './model/result.model.js';


dotenv.config();


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


await connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const races = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'races_2024.json'), 'utf-8')
);

const results = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'results_2024.json'), 'utf-8')
);

const importData = async () => {
  try {
    await Race.deleteMany();
    await Result.deleteMany();
    await User.deleteMany();
    await Prediction.deleteMany();

    await Race.insertMany(races);
    await Result.insertMany(results);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Race.deleteMany();
    await Result.deleteMany();
    await User.deleteMany();
    await Prediction.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}