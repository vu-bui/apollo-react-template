import { Document, model, Schema } from 'mongoose';

import { User } from '../models';

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  middlename: {
    type: String,
    trim: true,
    default: null,
  },
});

export const Users = model<User & Document>('User', UserSchema);
