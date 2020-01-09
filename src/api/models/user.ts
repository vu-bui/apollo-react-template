import { Input } from '.';

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  middlename?: string;
}

export type UserInput = Pick<Input<User>, Exclude<keyof Input<User>, 'username'>>;
