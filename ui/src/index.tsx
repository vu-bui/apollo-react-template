import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App';
import * as serviceWorker from './serviceWorker';

(async () => {
  const rootUrl = process.env.REACT_APP_ROOT_URL || process.env.PUBLIC_URL;
  window.config = await (await fetch(`${rootUrl}/config.json`)).json();
  ReactDOM.render((
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ), document.getElementById('root'));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();
