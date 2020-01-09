import { UserInputError } from 'apollo-server-express';
import pick from 'lodash/fp/pick';

import { Context, context } from '../auth';
import { User, UserInput } from '../models';
import { Users } from '../schemas';
import { isEqual, Paginable, pagination } from '../utils';

export interface UserFilter extends Paginable {
  ids?: string[];
}

export async function getUsers(filter: UserFilter): Promise<User[]> {
  const { offset, first } = pagination(filter);
  const query = Users.find();

  if (filter.ids) {
    query.in('_id', filter.ids);
  }

  query.skip(offset);
  query.limit(first);
  return query;
}

export async function updateUser(id: string, user: Partial<UserInput>, ctx = context()): Promise<User | null> {
  if (!canEdit(id, ctx)) {
    throw new UserInputError(`cannot update user ${id}`);
  }

  return Users.findByIdAndUpdate(
    id,
    { $set: pick(['firstname', 'lastname', 'middlename'], user) },
    { new: true },
  );
}

function canEdit(id: string, ctx: Context) {
  return ctx.user && isEqual(id, ctx.user.id);
}
