import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import App from './App';

import Home from './components/Home';

import Header from './components/Header';
import Footer from './components/Footer';

export default (
  <Router>
    <App>
      <Route exact={true} path="/" component={Home} />
    </App>
  </Router>
);
