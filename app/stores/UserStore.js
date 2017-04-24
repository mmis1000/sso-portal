import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
  constructor() {
    this.bindActions(UserActions);
    this.state = {
      users: []
    }
  }
  
  onUserLoad(users) {
    users.forEach(function (user) {
      user.__rev = 0;
    })
    this.setState({users});
  }
  
  onUserUpdate(newUser) {
    var newUsers = this.state.users.slice(0);
    newUsers = newUsers.map(function (user) {
      if (user.id !== newUser.id) {
        return user
      } else {
        newUser.__rev = user.__rev + 1;
        return newUser;
      }
    })
    this.setState({users: newUsers});
  }
  
  onUserRemove(userToRemove) {
    var newUsers = this.state.users.slice(0);
    newUsers = newUsers.filter((site)=> site.id !== userToRemove.id)
    this.setState({users: newUsers});
  }
}
export default alt.createStore(UserStore);