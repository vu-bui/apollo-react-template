import { resolve } from 'path';
import { Express } from 'express';
import create from 'swagger-express-middleware';
import { parse } from 'swagger-parser';
import { OpenAPIV2 } from 'openapi-types';
import memoize from 'lodash/fp/memoize';

import { middleware as auth } from '../auth';

import { dispatcher } from './dispatch';

export const enableSwagger = memoize(async (at: string, app: Express, { version, rootUrl }: { version: string; rootUrl: string }) => {
  const swagger = await parse(resolve(__dirname, 'swagger.yaml')) as OpenAPIV2.Document;
  swagger.info.version = version;
  swagger.host = rootUrl;
  swagger.basePath = at;

  await new Promise<void>((res, rej) => {
    create(swagger as any, app, (err, middleware) => {
      if (err) {
        rej(err);
        return;
      }

      app.use(
        middleware.metadata(),
        middleware.files({
          useBasePath: true,
          apiPath: '/swagger',
        }),
        middleware.parseRequest(),
        middleware.validateRequest(),
      );
      app.use(at, auth(), dispatcher as any);
      res();
    });
  });
});
