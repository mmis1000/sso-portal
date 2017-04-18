import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';
import AppActions from '../actions/AppActions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.bindActions(AppActions);
    this.state = {
      path: '/',
      logined: false,
      user: null
    };
  }

  /*onFindCharacterSuccess(payload) {
    payload.router.transitionTo('/characters/' + payload.characterId);
  }

  onFindCharacterFail(payload) {
    payload.searchForm.classList.add('shake');
    setTimeout(() => {
      payload.searchForm.classList.remove('shake');
    }, 1000);
  }*/
  
  onPathChange(path) {
    this.setState(Object.assign({}, this.state, {path}))
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

export default alt.createStore(NavbarStore);