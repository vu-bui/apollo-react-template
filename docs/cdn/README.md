# CDN
## How It Works
### Generic Builds
Because I want to keep this application simple and can be "build one, run everywhere", as well as ease the deployment, eliminating the need to push all asset to a cloud storage, the distribution package does not specify any specific URL for CDN, it's configurable instead.

The common configuration found for CDN set up is to embed the CDN (public) URL to the build package's `index.html` file for the browser to load. All the static asessts will be pushed to a cloud storage for CDN to run.

In this application, the static assets are linked relatively to the `index.html` file and are bundled to the API server. The API server will then serve those static assets along with `index.html` for requests comming from a browser, which support `text/html` in `Accept` header, so it can run alone without any extra server.

An extra `CDN_URL` is supported. If it's set, the web server will take extra step to do CORS protection as well as redirect access to `ROOT_URL` to `CDN_URL`

### Specific Builds
Conventional static build is also supported, in which static assets are statically bind to an address and are unable to change without triggering a new build. This is accomplished by setting `PUBLIC_URL` and `REACT_APP_ROOT_URL` environment variables during build process. In this set up, `CDN_URL` should not be set when starting the web server because it should be the only access point that serves both the APIs and the `index.html` file, unless there is at least 2 instances of the application running that play 2 different roles, API web server and static file web server.

## How To Configure
### Generic Builds
Typical configuration is to set the `ROOT_URL` to something like `https://api.mysite.com` and `CDN_URL` to `https://www.mysite.com`, so on normal usage, users will always access the CDN server instead. The CDN server will proxy requests to the API server and cache the response. The API server will always response with `Cache-Control` header as well as `Etag` and status code appropriately. Workflow is as follow
  1. Users access CDN server at `https://www.mysite.com`
  2. CDN will proxy request to API server at `https://api.mysite.com` and return the `index.html` file, and most of the time, the status will be 304 Not Modified
  3. The browser will load static assets from CDN site
  4. CDN will get those files from API server if they're not cached, otherwise they will be served from cache. CDN are configured to cache those file by reading `Cache-Control` header, which is set to 6 months. Most of the time, those will be served from the browser's cache before hitting the CDN.
  5. The browser will then load `/config.json` from the CDN site.
  6. The CDN will proxy the request to API server, and most of the time, it'll be responsed with 304 Not Modified.
  7. The browser will read the `ROOT_URL` from the config and start making API request to the API server.

The downside of this approach is that on typical usage, there will be 2 requests, `/index.html` and `/config.json`, that are proxied from the CDN to the API, but the good thing is that most of the time, it'll be responsed with 304 Not Modified. Configuration for this would also be pretty simple on most cloud providers, by just creating a CDN server and configure it to proxy the requests to API server. It will almost always read `Cache-Control` header by default.

### Static Builds
There are 2 deployment models for this type of build. Both need a CDN set up at `PUBLIC_URL` specified at build time, e.g. `https://static.mysite.com`. Static resources should be uploaded to the CDN beforehand to eliminate proxying content from the actual web server, though it's not required.

#### Single Cluster
In this model, there is one cluster, that could have many load-balanced instances, serving contents for `ROOT_URL` such as `https://www.mysite.com`. Browser's access to  `ROOT_URL` are always served with the `index.html` file that has linked to static assets at `PUBLIC_URL` specified at build time. XHR requests are served from this cluster as well and are passed through the static file hander.

### Multiple Clusters
In this model, there are 2 clusters, in which, each could invidually be load-balanced, composed of
  - API cluster serves API requests comming to `ROOT_URL`, e.g. `https://api.mysite.com`.
  - Static cluster servers browser's requests and only returns `index.html` file at `CDN_URL`, e.g. `https://www.mysite.com`.

In this set up, the `REACT_APP_ROOT_URL` environment variable must be specified at build time and must have the same value as the `ROOT_URL`.

This model is actually not my desired model so there are some confusions of the environment variable names as these are just work-around that I added to support these usages. I may come up with better idea to support this, but this is it at the moment.

[Home](/docs)
