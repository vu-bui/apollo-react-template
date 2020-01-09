import { Request, Response } from 'express';
import { unset } from 'lodash';
import { singular } from 'pluralize';
import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-express';

import { context } from '../auth';
import resolvers from '../graphql/resolvers';
import { rootValue } from '../graphql/root';

function transform(path: string) {
  // remove the '/' prefix
  path = path.substr(1);
  // remove /{param} parts
  return path.replace(/\/\{.*\}/g, '');
}

function translate(path: string) {
  path = singular(path);
  return `${path.charAt(0).toUpperCase()}${path.substr(1)}`;
}

function parse(req: Request) {
  // params in body, on path and query string
  // find param definition in body
  const inBody = req.swagger.params.find(p => p.in === 'body');
  return Object.assign(inBody ? { [inBody.name]: req.body } : {}, req.pathParams, req.query);
}

function getQuery(name: keyof typeof resolvers['Query']) {
  return resolvers.Query[name];
}

function getMutation(name: keyof typeof resolvers['Mutation']) {
  return resolvers.Mutation[name];
}

function map(docs: any | any[]) {
  return Array.isArray(docs) ? docs.map(mapInternal) : mapInternal(docs);
}

function mapInternal(doc: any) {
  if (!doc) {
    return doc;
  }
  doc = Object.assign({ id: doc.id }, doc._doc || doc);
  unset(doc, '_id');
  unset(doc, '__v');
  return doc;
}

export async function dispatcher(req: Request, res: Response) {
  const path = transform(req.swagger.pathName);
  const params = parse(req);
  let resolve: ((...args: any[]) => any) | null = null;
  switch (req.method) {
    case 'GET':
      // if there is an id in param, it's probably a get to a single object of a collection
      resolve = getQuery('id' in params ? singular(path) : path as any);
      break;

    case 'POST':
      res.status(201);
      resolve = getMutation(`create${translate(path)}` as any);
      break;

    case 'PUT':
    case 'PATCH':
      resolve = getMutation(`update${translate(path)}` as any);
      break;

    case 'DELETE':
      resolve = getMutation(`remove${translate(path)}` as any);
      break;
  }

  if (resolve) {
    try {
      const data = map(await resolve(rootValue, params, context()));
      if (data) {
        res.send(data);
        return;
      }
    } catch (e) {
      res.contentType('text/plain');
      if (e instanceof ApolloError) {
        if (e instanceof AuthenticationError) {
          res.status(401);
        } else if (e instanceof ForbiddenError) {
          res.status(403);
        } else {
          res.status(400);
        }
        res.send(e.message);
      } else {
        res.status(500).send(e instanceof Error ? e.message : e);
      }
      return;
    }
  }
  res.contentType('text/plain').status(404).send(!resolve ? 'Dispatcher cannot find a resolver for this request' : 'Not found');
}
