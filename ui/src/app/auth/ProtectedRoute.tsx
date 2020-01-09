import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';

import { useAuth } from '.';

const ProtectedRoute = (props: RouteProps) => {
  const { pathname, search } = useLocation();
  const { user } = useAuth();
  if (user) {
    return <Route {...props} />;
  }
  const redirectParams = new URLSearchParams(search);
  const accessToken = redirectParams.get('accessToken');
  const loginParams = new URLSearchParams();
  if (accessToken) {
    loginParams.set('accessToken', accessToken);
    redirectParams.delete('accessToken');
  }
  loginParams.set('redirect', `${pathname}?${redirectParams.toString()}`);

  return <Redirect to={`/login?${loginParams.toString()}`} />;
};

export default ProtectedRoute;
