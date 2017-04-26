import React from 'react';
import SiteStore from '../../../stores/SiteStore'

class User extends React.Component {
  constructor() {
    super();
    this.onSiteChange = this.onSiteChange.bind(this);
    this.onEditStart = this.onEditStart.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onAbort = this.onAbort.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.state = Object.assign(
      {},
      SiteStore.getState(),
      {editing: this.editing}
    );
    
    // refs
    this.sites = {};
    this.admin = null;
  }
  
  componentDidMount() {
    SiteStore.listen(this.onSiteChange);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.__rev !== this.props.__rev) {
      this.state.sites.forEach((site)=>{
        this.sites[site.id].checked = false;
      })
      
      nextProps.sites.forEach((site)=>{
        this.sites[site].checked = true;
      })
      
      this.admin.checked = this.props.isAdmin;
      this.setState({editing: false});
    }
  }
  
  componentWillUnmount() {
    SiteStore.unlisten(this.onSiteChange)
  }
  
  onSiteChange(state) {
    this.setState(state);
  }
  
  onEditStart() {
    this.setState({editing: true});
  }
  
  
  
  onAbort(ev) {
    ev.preventDefault();
    this.state.sites.forEach((site)=>{
      this.sites[site.id].checked = false;
    })
    
    this.props.sites.forEach((site)=>{
      this.sites[site].checked = true;
    })
    
    this.admin.checked = this.props.isAdmin;
    
    this.setState({editing: false});
  }
  
  onSave(ev) {
    ev.preventDefault();
    var isAdmin = false;
    var sites = []
    
    for (var site in this.sites) {
      if (this.sites[site].checked) {
        sites.push(site)
      }
    }
    
    if (this.admin.checked) {
      isAdmin = true;
    }
    this.props.updateUser(this.props.id, isAdmin, sites)
  }
  
  onRemove(ev) {
    this.props.removeUser(this.props.id);
  }
  
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
          {this.props.username} ({this.props.id.slice(0, 6)})
          
          <button type="button" className="btn btn-danger btn-sm pull-right" onClick={this.onRemove}>
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </button>
        </div>
        <div className="panel-body">
          <form className="form-horizontal" onSubmit={this.onSave}>
            {this.state.sites.map((site) => {
              console.log(this.props.sites, site.id)
              var hasSite = this.props.sites.indexOf(site.id) >= 0;
              return (
                <div className="form-group" key={site.id}>
                  <div className="col-xs-12">
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" 
                          defaultChecked={hasSite}
                          onClick={this.onEditStart}
                          ref={(el)=>{this.sites[site.id] = el}}
                          />
                        {site.name} ({site.id.slice(0, 6)})
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
            
            
            <div className="form-group">
              <div className="col-xs-12">
                <div className="checkbox">
                  <label>
                    <input type="checkbox" 
                      defaultChecked={this.props.isAdmin}
                      onClick={this.onEditStart}
                      ref={(el)=>{this.admin = el}}
                      />
                    Admin Mode
                  </label>
                </div>
              </div>
            </div>
            
            { 
              this.state.editing ?
              <div className="form-group">
                <div className="col-sm-4 col-sm-offset-4">
                  <button className="btn btn-block btn-danger" onClick={this.onAbort}>
                    Abort
                  </button>
                </div>
                <div className="col-sm-4">
                  <button className="btn btn-block btn-success">
                    Save
                  </button>
                </div>
              </div>
              :
              ("")
            }
          </form>
        </div>
      </div>
    )
  }
}

export default User;