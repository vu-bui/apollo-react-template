import { Primitive } from 'utility-types';

export * from './user';

type ArrayType<T extends any[]> = T extends (infer U)[] ? U : never;

// type InputType<T> =
//   T extends any[]
//   ? Array<Input<ArrayType<T>>>
//   : T extends object
//   ? Input<T>
//   : T extends Primitives
//   ? T
//   : Input<T>
// ;

type InputType<T> =
  T extends Primitive[]
  ? ArrayType<T>[]
  : T extends Primitive
  ? T
  : never
;

export type Input<T> = {
  [P in keyof Pick<T, Exclude<keyof T, 'id'>>]: InputType<T[P]>;
};
