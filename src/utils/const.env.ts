import dotenv from 'dotenv';
dotenv.config();

// require('dotenv').config();

export const PORT = process.env.PORT as string;
const SERVER_URL = process.env.SERVER_URL;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const SECRET = process.env.SECRET;
const GH_CLIENT_ID = process.env.GH_CLIENT_ID;
const GH_CLIENT_SECRET = process.env.GH_CLIENT_SECRET;
const GH_CALLBACK_URL = process.env.GH_CALLBACK_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

// export default {
//   PORT,
//   SERVER_URL,
//   DB_URL,
//   DB_NAME,
//   SECRET,
//   GH_CLIENT_ID,
//   GH_CLIENT_SECRET,
//   GH_CALLBACK_URL,
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
//   GOOGLE_CALLBACK_URL,
// };
