import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'; // ES6
import AppStore from './stores/AppStore'

class ProtectedRoute extends React.Component {
  render(){
    var hasAccess = true;
    
    if (this.props.requireLogin != AppStore.getState().logined) {
      hasAccess = false;
    }
    if (this.props.requireAdmin && (
        !AppStore.getState().logined ||
        !AppStore.getState().user.isAdmin
      )) {
      hasAccess = false;
    }
    
    if (hasAccess) {
      return (
        <Route {...this.props}/>
      );
    } else if (AppStore.getState().currentPath.indexOf(this.props.redirectTo) !== 0){
      return (
        <Redirect to={this.props.redirectTo}/>
      );
    } else {
      return null;
    }
  }
}
ProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
  requireLogin: PropTypes.bool
};
export default ProtectedRoute;