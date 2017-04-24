import React from 'react';
import SideBar from './DashBoard/SideBar'
import MySite from './DashBoard/MySite'
import EditUser from './DashBoard/EditUser'
import EditSite from './DashBoard/EditSite'
import {Route} from 'react-router-dom';

class DashBoard extends React.Component {
  constructor() {
    super();
    this.panels = [
      {name: "Edit sites", path: "/EditSite", requireAdmin: true, component: EditSite},
      {name: "Edit Users", path: "/EditUser", requireAdmin: true, component: EditUser},
      {name: "My sites", path: "/MySite", requireAdmin: false, component: MySite},
    ]
  }
  
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-2 col-sm-2 col-sm-offset-2'>
            <SideBar panels={this.panels} match={this.props.match}/>
          </div>
          <div className='col-xs-10 col-sm-6'>
            <Route exact path={this.props.match.path} render={()=>{
              return <div>Welcome to Dash Board</div>
            }} />
            {this.panels.map((panel)=>{
              return <Route key={panel.path} path={this.props.match.path + panel.path} component={panel.component} />
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default DashBoard;