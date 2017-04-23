import React from 'react';
import {Route} from 'react-router-dom';
import App from './components/App';
import Home from './components/Home';
import Login from './components/Login';
import DashBoard from './components/DashBoard';
import ProtectedRoute from './protected_route';
export default (
  <App>
    <Route exact path='/' component={Home} />
    <Route exact path='/Login' component={Login} />
    <ProtectedRoute requireLogin={true} redirectTo='/Login' path='/DashBoard' component={DashBoard} />
  </App>
);