
import 'zone.js';

import { Context as JwtContext } from './jwt';
import { Context as BearerContext } from './bearer';

type Merge<S, E> = { [k in keyof S | keyof E]: k extends keyof S ? S[k] : undefined };
export type Context = Merge<JwtContext, BearerContext> | Merge<BearerContext, JwtContext>;

const SESSION = 'session';
const CONTEXT = 'context';
// run a function inside zone with context object
export function run<P extends any[], R>(ctx: JwtContext | BearerContext, cb: (...args: P) => R, ...args: P): R {
  return Zone.current.fork({
    name: SESSION,
    properties: {
      [CONTEXT]: ctx,
    },
  }).run(cb, undefined, args, cb.toString());
}

// wrap a function inside zone with context object
export function bind<T extends (...args: any) => any>(ctx: JwtContext | BearerContext, func: T): T {
  return Zone.current.fork({
    name: SESSION,
    properties: {
      [CONTEXT]: ctx,
    },
  }).wrap(func, func.toString());
}

// get current context
export function context(): Context {
  return Zone.current.get(CONTEXT);
}
