import app from './src/app.js';
// import { initDB } from './src/database/db';
import { PORT } from './src/utils/const.env.js';

const port = PORT || 8080;

// initDB((error) => {
//   if (error) {
//     console.error(error);
//   } else {
//   }
// });

app.listen(port, () => {
  console.log(`App is listening running on port ${port}`);
});
