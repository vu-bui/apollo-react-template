import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import classname from 'classnames';

import { useAuth } from '../../auth';

const useStyles = makeStyles(theme => ({
  root: {
    'display': 'flex',
    'width': '100vw',
    'height': '100vh',

    '& > *': {
      margin: 'auto',
      width: '50vw',
      minWidth: 300,
      maxWidth: 500,
    },
  },
  content: {
    'display': 'flex',
    'flexDirection': 'column',
    '& > *:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  action: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: theme.spacing(2),
  },
  loading: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
  },
  overlay: {
    background: theme.palette.getContrastText(theme.palette.background.default),
    opacity: 0.5,
  },
  spinner: {
    margin: 'auto',
  },
}));

const LoginComponent = ({ location: { search } }: RouteComponentProps) => {
  const classes = useStyles();
  const { user, login, resume } = useAuth();
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<Error>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = e => setUsername(e.target.value);
  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = e => setPassword(e.target.value);
  const handleError = (e: Error) => {
    setError(e);
    // if it succeeded, the <Login> component will be destroyed
    // so we only setLoading to false if it failed
    setLoading(false);
  };

  const doLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (username && password) {
      setLoading(true);
      try {
        await login(username, password);
      } catch (e) {
        handleError(e);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    resume(new URLSearchParams(search).get('accessToken') || undefined)
      .catch(handleError);
  }, [search, resume]);

  if (user) {
    return <Redirect to={new URLSearchParams(search).get('redirect') || '/'} />;
  }

  return (
    <>
      <form className={classes.root} onSubmit={doLogin}>
        <Card>
          <CardHeader title={<FormattedMessage id='login.form.title' />} />
          <CardContent classes={{ root: classes.content }}>
            <TextField
              fullWidth
              required
              autoComplete='username'
              autoFocus
              label={<FormattedMessage id='login.form.username' />}
              error={!username}
              onChange={handleUsernameChange}
            />
            <TextField
              fullWidth
              required
              type='password'
              autoComplete='current-password'
              label={<FormattedMessage id='login.form.password' />}
              error={!password}
              onChange={handlePasswordChange}
            />
          </CardContent>
          <CardActions disableSpacing classes={{ root: classes.action }}>
            <Button variant='contained' color='primary' type='submit'><FormattedMessage id='login.form.login' /></Button>
          </CardActions>
        </Card>
      </form>
      {loading && (
        <div className={classes.loading}>
          <div className={classname(classes.loading, classes.overlay)} />
          <CircularProgress classes={{ root: classes.spinner }} />
        </div>
      )}
    </>
  );
};

export default LoginComponent;
