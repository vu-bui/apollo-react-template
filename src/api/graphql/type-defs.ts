import { gql } from 'apollo-server-express';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export default gql(readFileSync(resolve(__dirname, 'schema.gql'), { encoding: 'utf8' }));
