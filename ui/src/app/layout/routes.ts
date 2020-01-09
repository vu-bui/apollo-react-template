import { RouteConfig } from '../routes';
import Dashboard from '../pages/dashboard';

export const dashboard: RouteConfig = {
  path: '/dashboard',
  component: Dashboard,
};

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    redirect: '/dashboard',
  },
  dashboard,
];

export default routes;
