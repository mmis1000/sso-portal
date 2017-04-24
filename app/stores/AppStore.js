import alt from '../alt';
import AppActions from '../actions/AppActions';
import UserActions from '../actions/UserActions';


class AppStore {
  constructor() {
    this.bindActions(AppActions);
    this.bindActions(UserActions);
    this.state = {
      domain: '',
      currentPath: '/',
      currentSearch: {},
      user: null,
      logined: false
    }
  }
  
  onDomainName(domain) {
    this.setState({domain});
  }
  
  onSearchChange(search) {
    this.setState(Object.assign({}, this.state, {
      currentSearch: search
    }))
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
  
  onUserUpdate(user) {
    if (user.id === this.state.user.id) {
      this.setState({
        user
      })
    }
  }
  
}
export default alt.createStore(AppStore);