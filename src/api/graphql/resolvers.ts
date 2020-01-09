import mergeAll from 'lodash/fp/mergeAll';

import userResolvers from './user';

export default mergeAll([
  userResolvers,
]);
