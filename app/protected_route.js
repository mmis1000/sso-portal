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
    
    console.log(this.props.requireLogin, this.props.requireAdmin, AppStore.getState().user, hasAccess, this.props.redirectTo)
    
    if (hasAccess) {
      return (
        <Route {...this.props}/>
      );
    } else if (this.props.redirectTo !== '' ){
      return (
        <Redirect to={this.props.redirectTo}/>
      );
    } else {
      return (
        ""
      );
    }
  }
}
ProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
  requireLogin: PropTypes.bool
};
export default ProtectedRoute;