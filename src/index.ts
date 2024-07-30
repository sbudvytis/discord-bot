import createApp from './app';
import config from './config';
import createDatabase from './database';

const PORT = 3000;
const database = createDatabase(config.DATABASE_URL);
const app = createApp(database);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
