import passport from 'passport';
import once from 'lodash/fp/once';

import { enableJwt } from './jwt';
import { auth as bearerAuth, enableBearer } from './bearer';

export * from './context';
export { bearerAuth };

// config passport authentication strategies
export const initialize = once((url: string) => {
  enableJwt(url);
  enableBearer();
  return passport.initialize();
});

// get passport bearer middleware
export const middleware = once(() =>
  passport.authenticate(['jwt', 'bearer'], { session: false }),
);
