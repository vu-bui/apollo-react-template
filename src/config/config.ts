import { require as rootPathRequire } from 'app-root-path';
import { config } from 'dotenv';

config();

export const isTest = process.env.NODE_ENV === 'test';
export const isDev = !isTest && process.env.NODE_ENV !== 'production';
export const isProd = !isTest && !isDev;

// load default configs
if (isTest || isDev) {
  config({
    path: '.env.example',
  });
}

// if the app is invoked directly from node
if (!process.env.npm_package_version) {
  process.env.npm_package_version = rootPathRequire('package.json').version;
}

export const PORT = parseInt(process.env.PORT || '4000', 10);
export const ROOT_URL = process.env.ROOT_URL || '';
export const CDN_URL = process.env.CDN_URL || '';
export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '/graphql';
// this must map with basePath in swagger.yaml file
export const REST_ENDPOINT = process.env.REST_ENDPOINT || '/api';
export const MONGO_URL = process.env.MONGO_URL || '';
export const MONGO_TEST_URL = process.env.MONGO_TEST_URL || '';
export const VERSION = process.env.npm_package_version || 'unspecified';
export const LOG_FILE = process.env.LOG_FILE;
export const QUERY_LIMIT = parseInt(process.env.QUERY_LIMIT || '1000', 10);

// validate configs
if (isProd) {
  if (!ROOT_URL) {
    throw new Error('ROOT_URL is not set.');
  }
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not set.');
  }
}
if (isTest) {
  if (!MONGO_TEST_URL) {
    throw new Error('MONGO_TEST_URL is not set.');
  }
}
