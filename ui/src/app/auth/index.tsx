import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from 'apollo-link-ws';
import { gql } from 'graphql.macro';
import isEqual from 'lodash/fp/isEqual';

import { User } from '../models';

import ProtectedRoute from './ProtectedRoute';

/* global config:readonly */
const TOKEN = 'ar.login';

export interface WithAuthProps {
  user?: User;
  client?: ApolloClient<NormalizedCacheObject>;
  login: (username: string, password: string) => Promise<void>;
  resume: (token?: string) => Promise<void>;
  logout: () => void;
}

const meQuery = gql`
query me {
  me {
    id
    username
    firstname
    lastname
    middlename
  }
}
`;

export const AuthContext = createContext<WithAuthProps>({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [, setWsClient] = useState<SubscriptionClient>();
  const [client, setClient] = useState<WithAuthProps['client']>();
  const [user, setUser] = useState<WithAuthProps['user']>();

  const logout = useCallback(() => {
    setWsClient(wsClient => {
      if (wsClient) {
        wsClient.unsubscribeAll();
        wsClient.close();
      }
      return undefined;
    });
    setClient(client => {
      if (client) {
        client.stop();
      }
      return undefined;
    });
    setUser(undefined);
    localStorage.removeItem(TOKEN);
  }, []);
  const resume = useCallback((token = localStorage.getItem(TOKEN)) => new Promise<void>((res, rej) => {
    if (!token) {
      rej(new Error('no remember me token found!'));
      return;
    }
    const wsClient = new SubscriptionClient(
      `${config.ROOT_URL.replace(/^http/, 'ws')}${config.GRAPHQL_ENDPOINT}`,
      {
        reconnect: true,
        connectionParams: { token },
        connectionCallback: async e => {
          if (e) {
            logout();
            rej(e);
          } else {
            const user = (await client.query<{me: User}>({ query: meQuery })).data.me;
            localStorage.setItem(TOKEN, token);
            // because the user returned from cache is always a new object, which will trigger a change when we call setUser()
            // so we will have to check if the user object changed or not before setting it.
            // the typical use case is when the graphql websocket connection is closed and reconnected,
            // which happens quite a lot on production environment as nginx will close inactive connections after a specific timeout,
            // this connectionCallback will be called and will trigger a change on user state,
            // which will subsequently trigger a render on component that has useEffect() on user state from useAuth()
            // we usually have feedback on users when they are inputing the goals and check-in logs and get everything erased when this happens.
            setUser(old => isEqual(old, user) ? old : user);
            res();
          }
        },
      },
    );
    const client = new ApolloClient({
      link: new WebSocketLink(wsClient),
      cache: new InMemoryCache({
        cacheRedirects: {
          Query: {
            user: (root, { id }, { getCacheKey }) => getCacheKey({ __typename: 'User', id }),
          },
        },
      }),
      resolvers: {},
      // only isProd is available in client site
      connectToDevTools: !config.isProd,
    });
    setWsClient(old => {
      if (old) {
        wsClient.unsubscribeAll();
        wsClient.close();
      }
      return wsClient;
    });
    setClient(old => {
      if (old) {
        old.stop();
      }
      return client;
    });
  }), [logout]);
  const login = useCallback(
    async (username: string, password: string) =>
      // TODO call API somewhere to get bearer token
      resume(`${username}:${password}`),
    [resume],
  );

  const value: WithAuthProps = useMemo(
    () => ({ user, client, login, resume, logout }),
    [user, client, login, resume, logout],
  );
  if (client) {
    return (
      <AuthContext.Provider value={value}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </AuthContext.Provider>
    );
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const withAuth:
<T extends WithAuthProps>(Component: React.ComponentType<T>) =>
React.ComponentType<Pick<T, Exclude<keyof T, keyof WithAuthProps>>> =
  (Component: any) =>
    props =>
      <Component {...props} {...useContext(AuthContext)} />;

export const useAuth = () => useContext(AuthContext);

export { ProtectedRoute };
