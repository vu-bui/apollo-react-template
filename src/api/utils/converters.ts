import { ObjectId } from 'mongodb';

export function isObjectId(id: string | ObjectId): id is ObjectId {
  return typeof id !== 'string';
}

export function toString(id: string | ObjectId) {
  return isObjectId(id) ? id.toHexString() : id;
}

export function toObjectId(id: string | ObjectId) {
  return isObjectId(id) ? id : ObjectId.createFromHexString(id);
}

export function isEqual(a: string | ObjectId, b: string | ObjectId) {
  return toString(a) === toString(b);
}
