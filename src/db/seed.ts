import { MONGO_URL } from '../config';

import { connect, disconnect } from '.';

// tslint:disable:no-console
(async () => {
  await connect(MONGO_URL);
  // TODO import mongoose models and generate seed data as needed
  console.log('Seed data generated');
  await disconnect();
})();
// tslint:enable
