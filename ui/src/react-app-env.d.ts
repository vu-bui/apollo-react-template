/// <reference types="react-scripts" />
import * as conf from '../../src/config/config';

declare global {
  interface Window {
    config: typeof conf;
  }
  const config: Window['config'];
}

export { };
