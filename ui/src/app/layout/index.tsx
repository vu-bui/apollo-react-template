import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Routes } from '../routes';

import routes from './routes';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
}));

const Layout = () => {
  const classes = useStyles();
  return (
    <Container maxWidth={false} component='main' className={classes.content}>
      <Routes routes={routes} />
    </Container>
  );
};

export default Layout;
