import accepts from 'accepts';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { Express, RequestHandler } from 'express';
import { execute, subscribe } from 'graphql';
import { renderPlaygroundPage } from 'graphql-playground-html';
import { Server } from 'http';
import memoize from 'lodash/fp/memoize';
import { ExecuteFunction, SubscribeFunction, SubscriptionServer } from 'subscriptions-transport-ws';

import { bearerAuth, context, middleware, run } from '../auth';

import resolvers from './resolvers';
import { Root, rootValue } from './root';
import typeDefs from './type-defs';

export {
  typeDefs,
  resolvers,
  Root, rootValue,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: false,
});

export const apollo = new ApolloServer({
  schema,
  rootValue,
  playground: false,
  context,
});

export const enableGraphql = memoize((path: string, app: Express) => {
  // apply auth middleware to path to build context
  app.use(path, middleware());

  // apply graphql server
  apollo.applyMiddleware({
    path,
    app,
  });
});

export const enableSubscription = memoize((path: string, server: Server) => {
  SubscriptionServer.create({
    // FIXME typing errors
    execute: (sche, doc, root, ctx, ...args) => run(ctx, execute as ExecuteFunction, sche, doc, root, ctx, ...args),
    subscribe: (sche, doc, root, ctx, ...args) => run(ctx, subscribe as SubscribeFunction, sche, doc, root, ctx, ...args),
    schema,
    rootValue,
    onConnect: ({ token }: { token: string }) => bearerAuth(token),
  }, {
    path,
    server,
  });
});

export const enablePlayground = memoize((path: string, app: Express, endpoint = path, subscriptionEndpoint = endpoint) => {
  app.use(path, playgroundMiddleware(endpoint, subscriptionEndpoint));
});

export const playgroundMiddleware = memoize((endpoint = '/graphql', subscriptionEndpoint = endpoint): RequestHandler => {
  return (req, res, next) => {
    const types = accepts(req).types() as string[];
    if (types.indexOf('text/html') !== -1) {
      res.write(renderPlaygroundPage({
        endpoint,
        subscriptionEndpoint,
      }));
      res.end();
      return;
    }
    next();
  };
});
