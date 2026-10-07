import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`SpecLens Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  console.log(`Mock Mode: ${env.USE_MOCK ? 'ENABLED (using fixtures)' : 'DISABLED (live upstream)'}`);
});

export default server;
