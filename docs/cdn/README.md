# CDN
## How It Works
Because I want to keep this application simple and can be "build one, run everywhere", as well as ease the deployment, eliminating the need to push all assest to a cloud storage, the distribution package does not specify any specific URL for CDN, it's configurable instead.

The common configuration found for CDN set up is to embed the CDN URL to the build package's `index.html` file for the browser to load. All the static asessts, including the `index.html` file will be pushed to a cloud storage for CDN to run.

In this application, the static assests are linked relatively to the `index.html` file and are bundled to the API server. The API server will then serve those static assests along with `index.html` for requests comming from a browser, which support `text/html` in `Accept` header, so it can run alone without any extra server.

An extra `CDN_URL` is supported. If it's set, the web server will take extra step to do CORS protection as well as redirect access to `ROOT_URL` to `CDN_URL`

## How To Configure
Typical configuration is to set the `ROOT_URL` to something like `https://api.mysite.com` and `CDN_URL` to `https://www.mysite.com`, so on normal usage, users will always access the CDN server instead. The CDN server will proxy requests to the API server and cache the response. The API server will always response with `Cache-Control` header as well as `Etag` and status code appropriately. Workflow is as follow
  1. Users access CDN server at `https://www.mysite.com`
  2. CDN will proxy request to API server at `https://api.mysite.com` and return the `index.html` file, and most of the time, the status will be 304 Not Modified
  3. The browser will load static assests from CDN site
  4. CDN will get those files from API server if they're not cached, otherwise they will be served from cache. CDN are configured to cache those file by reading `Cache-Control` header, which is set to 6 months. Most of the time, those will be served from the browser's cache before hitting the CDN.
  5. The browser will then load `/config.json` from the CDN site.
  6. The CDN will proxy the request to API server, and most of the time, it'll be responsed with 304 Not Modified.
  7. The browser will read the `ROOT_URL` from the config and start making API request to the API server.

The downside of this approach is that on typical usage, there will be 2 requests, `/index.html` and `/config.json`, that are proxied from the CDN to the API, but the good thing is that most of the time, it'll be responsed with 304 Not Modified. Configuration for this would also be pretty simple on most cloud providers, by just creating a CDN server and configure it to proxy the requests to API server. It will almost always read `Cache-Control` header by default.

[Home](/docs)
