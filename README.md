# Apollo React Template
MIT-licensed template for scaffolding self-contained NodeJS web server backed by MongoDB with both GraphQL and Swagger endpoints. Tech stack usage are
  - [MongoDB](https://www.mongodb.com)
  - [Express](https://expressjs.com)
  - [Apollo GraphQL](https://www.apollographql.com)
  - [Swagger Middleware](https://apitools.dev/swagger-express-middleware)
  - [Passport.js](http://www.passportjs.org)
  - [React](https://reactjs.org)
  - [Material UI](https://material-ui.com)

## Features
  - Expose a configrable `/graphql` endpoint that support both HTTP and WebSocket requests. Subscriptions are also supported.
  - A configurable Swagger descriptor endpoint at `/api/swagger` and all other RESTful APIs that acts as a compatible proxy to GraphQL resolvers.
  - A web UI built on React and Apollo that is packaged to the server on build. The UI is styled using Material UI and JSS.
  - A build system that supports building to a self-contained NodeJS web server with appropriate versioning that can run natively or inside Docker container.
  - Docker Compose files that support starting a Docker stack of the application.
  - A Jenkins pipeline that is suitable to build the application as well as a Docker Compose file to start the sustainable Jenkins server.
  - Visual Studio Code support.

## Getting Started
### Required Software
  - [MongoDB 4+](https://www.mongodb.com) with [replica set](https://docs.mongodb.com/manual/tutorial/deploy-replica-set). If no replica set is set up, subscription won't work because it's built based on replica set oplog. Starting the system in cluster mode might also need it as a communication channel, depends on how we code.
  - [NodeJS 12+](https://nodejs.org)
  - [Visual Studio Code](https://code.visualstudio.com) for development.
  - [Docker](https://docs.docker.com/install) for hosting Jenkins and building docker distributions

### Development Configurations
Create a file in root directory and name it `.env` and override any configurations in `.env.example` as needed.

### Commands
  - Install dependencies
```shell
npm i
```
  - Start API development web server
```shell
npm run dev
```
  - Start UI development server
```shell
cd ui
npm run dev
```
  - Build the source code (can optionally set `VERSION` environment variable to mark the version for the package)
```shell
npm run build
```
  - Produce distribution package for the current host OS
```shell
npm run dist
```
  - Populate seed data
```shell
npm run db:seed
```
  - Clean up all data
```shell
npm run db:reset
```

### Setting Up IDE
Install the following Visual Studio Code plugins
  - [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo)

Debug the API server by pressing `F5` or go to `Debug > Start Debugging`.

### Setting Up Jenkins
  - Install Docker
  - Start or join a Docker swarm
```shell
docker swarm init
```
  - Run the following command
```shell
cd docker-compose
docker stack deploy -c docker-compose.ci.yml ci
```
  - Go to the Jenkins server at port `8080` and add new Multibranch Pipeline project using the project's Git URL.

## Documentation
Please read [here](/docs).
