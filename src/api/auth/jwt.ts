import { URL } from 'url';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifyCallbackWithRequest } from 'passport-jwt';
import memoize from 'lodash/fp/memoize';

import { run } from './context';

export interface JwtPayload {
  jti: string;
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
}

export interface Context  {
  token: string;
  payload: JwtPayload;
}

export const enableJwt = memoize((url: string) => {
  // 3rd-party app
  const hostname = new URL(url).hostname;
  const verifier: VerifyCallbackWithRequest = (req, payload: JwtPayload, done) => {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new Error('invalid token');
    }
    const ctx: Context = {
      token,
      payload,
    };
    run(ctx, done, null, ctx);
  };
  passport.use(new Strategy(
    {
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // TODO get from SSL_CERT
      secretOrKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwsZridbNRZSsFfht3JPY
IPpB4PkadCn/jYhOXKJH5dzxu/ZJaaGKcKN0r+oh0VB3AFbgVIfuISGHmnNNRI6T
keSbTHWLO6cPbYj3gG7ebKl53GFG1vfWwnCPzqWeeWBfnszNYkK+GURNFS1h2N1s
FcTzJZgHZbU+tZzOY5BiFOQoo5RRhk+qegLFbPlP6sJv7VV6416n7Ivl1PnCdtGH
QmvznD+XJ3clc+aPz5TBZc7VebViZ35CtZF09O8vDRdaBZ7S9jMNgfodNXhDdx1S
+qZ/nMRTsEqIi7IG8+kt7BkEBjqor03AOE9yheomn+Pr77Giz7X3oip+7SoQVEV0
ZQIDAQAB
-----END PUBLIC KEY-----`,
      // TODO get from SSL_CERT
      issuer: hostname,
      audience: hostname,
      jsonWebTokenOptions: {
        // only allow sm app for now
        subject: 'sm',
        // more hard-coded security layer
        jwtid: 'add1cfad-9954-4577-a3d3-fb4773559c5e',
      },
    },
    verifier,
  ));
});
