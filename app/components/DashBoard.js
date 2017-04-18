import React from 'react';
import AppStore from '../stores/AppStore';

class DashBoard extends React.Component {
  constructor() {
    super();
  }
  
  componentDidMount() {
    if (!AppStore.getState().logined) {
      browserHistory.replace("/Login")
    }
  }
  
  render() {
    return (
      <div className='alert alert-info'>
        Dashboard
      </div>
    );
  }
}

export default DashBoard;