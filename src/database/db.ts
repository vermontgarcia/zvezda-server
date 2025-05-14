import mongoose from 'mongoose';
import { DB_URL, DB_NAME } from '../utils/const.env.js';

let database: typeof mongoose;

export const initDB = async (callback: {
  (error: any): void;
  (arg0: null, arg1: typeof mongoose): void;
}) => {
  if (database) {
    console.log('DB is already initialized!');
    return callback(null, database);
  }
  try {
    const db = await mongoose.connect(DB_URL, { dbName: DB_NAME });
    database = db;
    console.log(
      `Connected to Mongo! Database name: "${db.connections[0].name}"`
    );
    callback(null, database);
  } catch (error) {
    console.error('DB connection error: ', error);
    callback(error);
  }
};

export const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};
