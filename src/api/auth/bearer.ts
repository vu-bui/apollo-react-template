import once from 'lodash/fp/once';
import passport from 'passport';
import { Strategy } from 'passport-http-bearer';

import { User } from '../models';
import { Users } from '../schemas';

import { run } from './context';

export interface Context {
  token: string;
  user: User;
}

export const enableBearer = once(() => {
  passport.use(new Strategy(
    {
      passReqToCallback: false,
      scope: '',
      realm: '',
    },
    async (token, done) => {
      try {
        const ctx = await auth(token);
        run(ctx, done, null, ctx);
      } catch (e) {
        done(null, false, e);
      }
    },
  ));
});

export async function auth(token: string): Promise<Context> {
  // TODO validate token with auth server
  let user = await Users.findOne();
  if (!user) {
    user = await Users.create({
      username: 'vubui',
      firstname: 'Vu',
      lastname: 'Bui',
    });
  }

  return {
    token,
    user,
  };
}
