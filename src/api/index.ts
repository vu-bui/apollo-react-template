import { createServer, Server } from 'spdy';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import accepts from 'accepts';
import { parse } from 'url';
import { resolve } from 'app-root-path';

import { bootstrap } from '../bootstrap';

import { initialize } from './auth';
import { enableGraphql, enablePlayground, enableSubscription } from './graphql';
import { enableSwagger } from './swagger';

export interface Config {
  isDev: boolean;
  isProd: boolean;
  port: number;
  rootUrl: string;
  cdnUrl?: string;
  graphqlEnpoint: string;
  restEnpoint: string;
  version: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const conf: Config = {} as Config;
export function config(config?: Partial<Config>) {
  if (config) {
    Object.assign(conf, config);
  }
  return conf;
}

let server: Server;
export function stop() {
  return new Promise<void>((res, rej) => {
    if (!server) {
      res();
      return;
    }
    server.close(err => err ? rej(err) : res());
  });
}

export async function start(conf?: Partial<Config>) {
  if (server) {
    logger.info('server is restarting...');
    await stop();
  }
  const {
    isDev, isProd,
    port, rootUrl, cdnUrl,
    graphqlEnpoint, restEnpoint,
    version,
  } = config(conf);

  // create server
  const app = express();
  server = createServer({
    spdy: {
      plain: true,
    },
  }, app);

  // error handler for dev env
  if (isDev) {
    const { default: errorhandler } = await import('errorhandler');
    app.use(errorhandler({
      log: logger.error,
    }));
  }

  // some useful middlewares
  const origin = [rootUrl];
  if (cdnUrl) {
    origin.push(cdnUrl);
  }
  app.use(cors({
    origin,
  }));
  app.use(compression());

  // server configs
  app.get('/config.json', async (req, res) => {
    res.set('Cache-Control', 'public, max-age=0');
    res.json({
      isProd,
      ROOT_URL: rootUrl,
      GRAPHQL_ENDPOINT: graphqlEnpoint,
      REST_ENDPOINT: restEnpoint,
      VERSION: version,
    });
  });

  // initialize auth
  app.use(initialize(rootUrl));

  // enable graphql
  if (isDev) {
    enablePlayground(graphqlEnpoint, app);
  }
  enableGraphql(graphqlEnpoint, app);
  enableSubscription(graphqlEnpoint, server);

  // enable swagger
  await enableSwagger(restEnpoint, app, { version, rootUrl });

  // always serve index.html for requests accept it. i.e. browsers
  app.use('/', (req, res, next) => {
    const types = accepts(req).types() as string[];
    if (types.indexOf('text/html') !== -1) {
      if (cdnUrl && parse(cdnUrl).host !== req.hostname) {
        logger.warn(`invalid access to ${req.hostname}`);
        logger.info(`redirect to ${cdnUrl}`);
        res.redirect(`${cdnUrl}${req.url}`);
      } else {
        res.sendFile(resolve('public/index.html'));
      }
    } else {
      next();
    }
  });

  // static assets
  app.use('/', express.static(resolve('public'), {
    maxAge: '1y',
  }));

  server.listen(port, () => {
    logger.info(`api server started at ${rootUrl}`);
    if (cdnUrl) {
      logger.info(`static assets are served from ${cdnUrl}`);
    }
  });
}

(async () => {
  await bootstrap(async ({
    isDev, isProd,
    PORT, ROOT_URL, CDN_URL,
    GRAPHQL_ENDPOINT, REST_ENDPOINT,
    VERSION,
  }) => {
    logger.info('starting web api server...');
    await start({
      isDev, isProd,
      port: PORT, rootUrl: ROOT_URL, cdnUrl: CDN_URL,
      graphqlEnpoint: GRAPHQL_ENDPOINT, restEnpoint: REST_ENDPOINT,
      version: VERSION,
    });
  }, stop);
})();
