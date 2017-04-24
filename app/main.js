import React from 'react';
import { Router } from 'react-router-dom'
import { render } from 'react-dom'
import routes from './routes';
import createHistory from 'history/createBrowserHistory'

import AppActions from './actions/AppActions';
import NavbarAction from './actions/NavbarActions';
import AppStore from './stores/AppStore';
import NavbarStore from './stores/NavbarStore';
import alt from './alt'

alt.bootstrap(__flux_state__)

const browserHistory = window.browserHistory = createHistory()

AppActions.updatePath(browserHistory.location.pathname);
browserHistory.listen(function (location) {
  AppActions.updatePath()
})

render((
  <Router history={browserHistory}>
    {routes}
  </Router>
), document.getElementById('app'))