import React from 'react';

class Site extends React.Component {
  constructor() {
    super()
    this.onUpdate = this.onUpdate.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onRemove = this.onRemove.bind(this)
    
    this.state = {editing: false}
  }
  
  componentDidMount() {
    this.updateData = this.props.updateData;
  }
  
  onChange() {
    this.setState({editing: true})
  }
  
  onCancel(e) {
    e.preventDefault();
    
    this.siteName.value = this.props.name
    this.siteType.value = this.props.type
    this.siteEntry.value = this.props.entry
    
    this.setState({editing: false})
  }
  
  onUpdate(e) {
    e.preventDefault();
    this.props.updateSite(this.props.id, this.siteName.value, this.siteType.value, this.siteEntry.value)
  }
  
  onRemove() {
    this.props.siteRemove(this.props.id)
  }
  
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
          {this.props.name} ({this.props.id.slice(0, 6)})
          
          <button type="button" className="btn btn-danger btn-sm pull-right" onClick={this.onRemove}>
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </button>
        </div>
        <div className="panel-body">
          <div className="container-fluid">
            <div className="row">
              
                <form className="form-horizontal" onSubmit={this.onUpdate}>
                  <div className="form-group">
                    <label htmlFor={this.props.id + "-name"} className="col-sm-2 control-label">Name</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id={this.props.id + "-name"} 
                        onChange={this.onChange}
                        defaultValue={this.props.name}
                        placeholder="Name" 
                        ref={(siteName) => this.siteName = siteName}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor={this.props.id + "-type"} className="col-sm-2 control-label">Type</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id={this.props.id + "-type"}
                        onChange={this.onChange}
                        defaultValue={this.props.type}
                        placeholder="Type" 
                        ref={(siteType) => this.siteType = siteType}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor={this.props.id + "-entry"} className="col-sm-2 control-label">Entry</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" id={this.props.id + "-entry"}
                        onChange={this.onChange}
                        defaultValue={this.props.entry}
                        placeholder="Entry" 
                        ref={(siteEntry) => this.siteEntry = siteEntry}/>
                    </div>
                  </div>
                  { 
                    this.state.editing ?
                    <div className="form-group">
                      <div className="col-sm-4 col-sm-offset-4">
                        <button className="btn btn-block btn-danger"
                          onClick={this.onCancel}>
                          Reset
                        </button>
                      </div>
                      <div className="col-sm-4">
                        <button className="btn btn-block btn-success">Save</button>
                      </div>
                    </div>
                    :
                    ("")
                  }
                </form>
                
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Site;