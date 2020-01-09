import React from 'react';
import { generatePath, match as MatchProps, Redirect, Route, RouteProps, Switch, SwitchProps, useRouteMatch } from 'react-router-dom';

import { ProtectedRoute } from '../auth';
import Login from '../pages/login';
import Layout from '../layout';

export interface RouteConfig extends RouteProps {
  path: string;
  redirect?: string;
  requireAuth?: boolean;
  basePath?: string;
}

export const renderRoutes = (routes: RouteConfig[], match?: MatchProps | null, switchProps?: SwitchProps) => {
  const basePath = (match && match.path !== '/') ? match.path : '';
  // populate basePath for resolvePath to run
  routes.forEach(r => r.basePath = basePath);
  return (
    <Switch {...switchProps}>
      {routes.map(({ redirect, requireAuth, path, ...routeProps }, i) =>
        redirect
          ? <Redirect key={i} path={`${basePath}${path}`} to={`${basePath}${redirect}`} {...routeProps} />
          : requireAuth
            ? <ProtectedRoute key={i} path={`${basePath}${path}`} {...routeProps} />
            : <Route key={i} path={`${basePath}${path}`} {...routeProps} />,
      )}
    </Switch>
  );
};

export const Routes = ({ routes, switchProps }: { routes: RouteConfig[]; switchProps?: SwitchProps }) =>
  renderRoutes(routes, useRouteMatch(), switchProps);

// the route must be rendered at least one to have the basePath of where it'll be located
// we're trying to make the sub routes generic enough to not knowing their ancestors
// so in case a route has never been rendered, it's correct to assume that it'll be located in root path
// though it's not what we always expect, but it'll work most of the time
export const resolvePath = (route: RouteConfig, params: Record<string, string | number | boolean | undefined> = {}) =>
  generatePath(`${route.basePath || ''}${route.path}`, params);

const routes: RouteConfig[] = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    requireAuth: true,
  },
];

export default routes;
