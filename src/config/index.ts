import * as conf from './config';

declare global {
  namespace NodeJS {
    interface Global {
      config: typeof conf;
    }
  }

  const config: NodeJS.Global['config'];
}

global.config = conf;

export = conf;
