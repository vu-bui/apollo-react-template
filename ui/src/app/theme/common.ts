import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { blueGrey, deepOrange, deepPurple } from '@material-ui/core/colors';

const themeOptions: ThemeOptions = {
  palette: {
    primary: deepPurple,
    secondary: blueGrey,
    error: deepOrange,
  },
};

export default themeOptions;
