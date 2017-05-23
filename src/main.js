import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';

import {
  BrowserRouter as Router,
  browserHistory,
  Route,
  Link
} from 'react-router-dom';

ReactDOM.render(
  <Router history={browserHistory}>{routes}</Router>,
   document.getElementById('app')
);
