import React from 'react';
import { Link } from 'react-router-dom'
import {Route} from 'react-router-dom';
import AppStore from '../../stores/AppStore';


class SideBar extends React.Component {
  render(){
    return (
      <div className="list-group">
        {
          this.props.panels.map((item)=>{
            if (item.requireAdmin && (!AppStore.getState().logined || !AppStore.getState().user.isAdmin)) {
              return ('')
            } else {
              return (
                <Link key={item.path} to={this.props.match.path + item.path} className="list-group-item">{item.name}</Link>
              )
            }
          })
        }
      </div>
    );
  }
}
export default SideBar;