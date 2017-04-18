import alt from '../alt';
import AppActions from '../actions/AppActions';

class AppStore {
  constructor() {
    this.bindActions(AppActions);
    this.state = {
      currentPath: '/',
      user: null,
      logined: false
    }
  }
  
  onPathChange(path) {
    this.setState(Object.assign({}, this.state, {
      currentPath: path
    }))
  }
  
  onLoginStatusSuccess(user) {
    this.setState(Object.assign({}, this.state, {
      user,
      logined: true
    }))
  }
  
  onLoginStatusFail(req) {
    this.setState(Object.assign({}, this.state, {
      user: null,
      logined: false
    }))
  }
}
export default alt.createStore(AppStore);