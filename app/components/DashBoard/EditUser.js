import React from 'react';
import { Link } from 'react-router-dom'
import User from './EditUser/User'
import UserStore from '../../stores/UserStore'
import UserActions from '../../actions/UserActions'
import SiteActions from '../../actions/SiteActions'

class EditUser extends React.Component {
  constructor () {
    super();
    this.onChange = this.onChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.state = UserStore.getState();
  }
  
  componentDidMount() {
    UserStore.listen(this.onChange);
    UserActions.loadUsers()
    SiteActions.loadSites();
  }
  
  componentWillUnmount() {
    UserStore.unlisten(this.onChange);
  }
  
  onChange(state) {
    this.setState(state);
  }
  
  updateUser(id, isAdmin, sites) {
    var originalUser = this.state.users.find((i)=>i.id===id)
    UserActions.updateUser(
      id, 
      originalUser.username, 
      isAdmin, 
      sites, 
      originalUser.setting)
  }
  
  removeUser(id) {
    UserActions.removeUser(id)
  }
  
  render(){
    console.log(this.state.users)
    return (
      <div className="list-group">
        {this.state.users.map((user)=>{
          return <User 
            key={user.id} 
            updateUser={this.updateUser}
            removeUser={this.removeUser}
            {...user}
            />
        })}
      </div>
    );
  }
}
export default EditUser;