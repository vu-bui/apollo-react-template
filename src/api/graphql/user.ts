import { Context } from '../auth';
import { UserInput } from '../models';
import { UserService } from '../services';

import { Root } from '.';

export default {
  Query: {
    me: (r: Root, p: unknown, ctx: Context) => ctx.user || null,
    user: async (r: Root, { id }: { id: string }) => (await UserService.getUsers({ ids: [id] }))[0],
    users: (r: Root, filter: UserService.UserFilter) => UserService.getUsers(filter),
  },
  Mutation: {
    // if it's authenticating using app, the service will reject it
    updateMe: (r: Root, { user }: { user: Partial<UserInput> }, ctx: Context) => UserService.updateUser(ctx.user ? ctx.user.id : '', user),
  },
};
