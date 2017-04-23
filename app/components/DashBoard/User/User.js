import React from 'react';
import SiteStore from '../../stores/SiteStore'

class User extends React.Component {
  constructor() {
    super();
  }
  
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
          {this.props.username} ({this.props.id.slice(0, 6)})
        </div>
        <div className="panel-body">
          {SiteStore.getState().sites.map(function (site) {
            return (
              <label>
                <input type="checkbox" value=""/>
                {site.name} ({site.id.slice(6)})
              </label>
            )
          })}
        </div>
      </div>
    )
  }
}

export default User;