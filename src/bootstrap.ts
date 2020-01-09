import 'source-map-support/register';
import exitHook from 'async-exit-hook';
import once from 'lodash/fp/once';

import * as config from './config';
import { setApp, toFile } from './logger';
import { connect, disconnect } from './db';

// TODO allow configuring connection poolSize
export const bootstrap = once(async (spinup: (conf: typeof config) => any, teardown?: () => any) => {
  // setup logger
  setApp(process.env.name || 'unknown');
  if (config.LOG_FILE) {
    toFile(config.LOG_FILE);
  }

  // graceful shutdown hook
  exitHook(async done => {
    logger.info('server is shutting down');
    await Promise.all([disconnect(), async () => teardown && teardown()]);
    logger.info('server stopped');
    done();
  });

  // start DB
  await connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoReconnect: true,
    useUnifiedTopology: true,
  });

  await spinup(config);

  if (process.send) {
    process.send('ready');
  }
});
