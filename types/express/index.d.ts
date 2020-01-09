import 'express';

declare module 'express' {
  interface Request {
    swagger: {
      pathName: string;
      params: [{
        name: string;
        in: 'path' | 'query' | 'body';
      }];
    };
    pathParams: {
      [key: string]: any;
    };
  }
}
