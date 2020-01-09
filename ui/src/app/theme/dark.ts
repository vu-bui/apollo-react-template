import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import merge from 'lodash/fp/merge';

import themeOptions from './common';

export default merge<Partial<ThemeOptions>>({
  palette: {
    type: 'dark',
  },
})(themeOptions);
