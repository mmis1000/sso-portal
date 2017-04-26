import React from 'react';

class AddSite extends React.Component {
  constructor() {
    super()
    this.onAdd = this.onAdd.bind(this)
    this.onClear = this.onClear.bind(this)
    this.state = {editing: false, random: "edit-site-add-site"}
  }
  
  onClear (e) {
    e.preventDefault();
    this.siteName.value = "";
    this.siteType.value = "";
    this.siteEntry.value = "";
    this.siteDomain.value = "";
  }
  
  onAdd(e) {
    e.preventDefault();
    this.props.addSite(this.siteName.value, this.siteType.value, this.siteEntry.value, this.siteDomain.value)
  }
  
  render() {
    return (
      <div className="panel panel-info">
        <div className="panel-heading">Create A new Site</div>
        <div className="panel-body">
          <div className="container-fluid">
            <div className="row">
              
                <form className="form-horizontal" onSubmit={this.onAdd}>
                  <div className="form-group">
                    <label htmlFor={this.state.random + "-name"} className="col-sm-2 control-label">Name</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id={this.state.random + "-name"} 
                        placeholder="Name" 
                        ref={(siteName) => this.siteName = siteName}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor={this.state.random + "-type"} className="col-sm-2 control-label">Type</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id={this.state.random + "-type"}
                        placeholder="Type" 
                        ref={(siteType) => this.siteType = siteType}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor={this.state.random + "-entry"} className="col-sm-2 control-label">Entry</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id={this.state.random + "-entry"}
                        placeholder="Entry" 
                        ref={(siteEntry) => this.siteEntry = siteEntry}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor={this.state.random + "-domain"} className="col-sm-2 control-label">Domain</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id={this.state.random + "-domain"}
                        placeholder="Domain" 
                        ref={(siteDomain) => this.siteDomain = siteDomain}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-4 col-sm-offset-4">
                      <button className="btn btn-block btn-danger"
                        onClick={this.onClear}>
                        Clear
                      </button>
                    </div>
                    <div className="col-sm-4">
                      <button className="btn btn-block btn-success">Create</button>
                    </div>
                  </div>
                </form>
                
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AddSite;