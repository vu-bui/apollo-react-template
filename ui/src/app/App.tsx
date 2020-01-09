import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';

import { SwitchThemeProvider } from './theme';
import { AuthProvider } from './auth';
import { en } from './translations';
import routes, { Routes } from './routes';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

const App = () => {
  const classes = useStyles();

  return (
    <React.StrictMode>
      <SwitchThemeProvider>
        <AuthProvider>
          <div className={classes.root}>
            <CssBaseline />
            <IntlProvider locale='en' messages={en}>
              <Routes routes={routes} />
            </IntlProvider>
          </div>
        </AuthProvider>
      </SwitchThemeProvider>
    </React.StrictMode>
  );
};

export default App;
