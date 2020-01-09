import { ChangeStream } from 'mongodb';
import partial from 'lodash/fp/partial';

export enum OperationType {
  insert = 'insert',
  delete = 'delete',
  replace = 'replace',
  update = 'update',
  drop = 'drop',
  rename = 'rename',
  dropDatabase = 'dropDatabase',
  invalidate = 'invalidate',
}

export interface ChangeEvent<T> {
  _id: {
    _data: string;
  };
  operationType: OperationType;
  fullDocument: T;
  ns: {
    db: string;
    coll: string;
  };
  to: {
    db: string;
    coll: string;
  };
  documentKey: {
    _id: string;
  };
  updateDescription: {
    updatedFields: any;
    removedFields: any;
  };
  clusterTime: any;
  txnNumber: number;
  lsid: string;
}

export function* iterator<T, D = T>(cs: ChangeStream, filter?: (ce: ChangeEvent<T>) => D | null): Iterator<Promise<D | null>> {
  let hasNext = true;
  while (hasNext) {
    yield new Promise<D | null>((res, rej) => {
      const check = () => {
        cs.next().then(e => {
          if (e) {
            const d = filter ? filter(e) : e.fullDocument;
            if (d) {
              res(d);
            } else {
              check();
            }
          } else {
            hasNext = false;
            res(null);
          }
        }).catch(rej);
      };
      check();
    });
  }
}

export async function* asyncIterator<T, D = T>(cs: ChangeStream, filter?: (ce: ChangeEvent<T>) => D | null): AsyncIterator<D> {
  while (await cs.hasNext()) {
    const e = await cs.next();
    const d = filter ? filter(e) : e.fullDocument;
    if (d) {
      yield d;
    }
  }
}

export function iterable<T, D = T>(cs: ChangeStream, filter?: (ce: ChangeEvent<T>) => D | null): Iterable<Promise<D | null>> & AsyncIterable<D> {
  return {
    [Symbol.iterator]: partial(iterator, [cs, filter]),
    [Symbol.asyncIterator]: partial(asyncIterator, [cs, filter]),
  };
}
