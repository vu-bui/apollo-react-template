import { MONGO_URL } from '../config';

import { connect, connection, disconnect } from '.';

// tslint:disable:no-console
(async () => {
  await connect(MONGO_URL);
  await connection.dropDatabase();
  console.log('Data cleared');
  await disconnect();
})();
// tslint:enable
