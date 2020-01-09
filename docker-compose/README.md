# Apollo React Template
##  Structure
  - [`docker-compose.ci.yml`](docker-compose.ci.yml) contains a Jenkins setup that is suitable to serve as a CI tool for this project.
  - [`docker-compose.dev.yml`](docker-compose.dev.yml) will spin up a running instance of this project with no reverse proxy nor SSL setup that is suitable for development server. `HTTP_PORT` can be set to change the target port. It's default to `80`
  - [`docker-compose.prod.yml`](docker-compose.prod.yml) will spin up both web server and a reverse proxy with SSL termination setup that is suitable for production server. A [./ssl](./ssl) directory must be available and it must contain 3 files, that are a certificate, a private key, and a dhparam key, that must be named `cert.pem`, `key.pem`, and `dhparam.pem` respectively. `HTTP_PORT` and `HTTPS_PORT` can be set and are default to `80` and `443`. HTTP access to the server will be redirected to HTTPS.
  - [`docker-compose.db.yml`](docker-compose.db.yml) can be appended to either `docker-compose.dev.yml` or `docker-compose.prod.yml` to spin up a internal MongoDB instance.
  - [`docker-compose.dba.yml`](docker-compose.dba.yml) can be appended to `docker-compose.db.yml` to also spawn a Mongo Express web server that can be used to manage the internal MongoDB. `MONGO_EXPRESS_PORT` can be set to change the port and is default to `8081`.

## Usage
Because `docker stack` uses docker compose version 3 and there are some limitations with those, `.env` file is not added as part of this package. Thus, environment variables that are needed for the application to run must be exported beforehand. Please read either the [`.env.example`](../.env.example) file or the docker-compose files to see the variables that can and must be set.

  - To build up CI server
```
docker stack deploy -c docker-compose.ci.yml ci
```
  - To start development instance with both MongoDB and Mongo Express
```
docker stack deploy -c docker-compose.dev.yml -c docker-compose.db.yml -c docker-compose.dba.yml ar
```
  - To start production server with external MongoDB
```
docker stack deploy -c docker-compose.prod.yml ar
```
  - To list all created volume
```
docker volume ls
```
  - To get the path to the volume storage
```
docker volume inpsect <volume_name>
```

## Important Notes
The `docker-compose.db.yml` is starting up a replica set named `rs0` while using official MongoDB image `mongo:latest`. There is no easy way to automatically initiate the replica set without using mongo shell, unless we create a custom version of the MongoDB image. Until then, when we first start the MongoDB container using `docker-compose.db.yml` file, we must manually initiate the cluster using `docker exec` following [this guides](https://docs.mongodb.com/manual/tutorial/deploy-replica-set/#initiate-the-replica-set).
