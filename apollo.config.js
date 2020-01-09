module.exports = {
  service: {
    localSchemaFile: 'src/api/graphql/schema.gql',
  },
  client: {
    localSchemaFile: 'src/api/graphql/schema.gql',
    includes: ['ui/src/**/*.ts*'],
  },
};
