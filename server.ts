import server from './src/app.js';
import { initDB } from './src/database/db.js';
import { PORT } from './src/utils/const.env.js';

const port = PORT || 8080;

initDB((error: any) => {
  if (error) {
    console.error(error);
  } else {
    server.listen(port, () => {
      console.log(`App is listening running on port ${port}`);
    });
  }
});
