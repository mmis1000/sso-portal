import React from 'react';

class Site extends React.Component {
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
          {this.props.name} ({this.props.id.slice(0, 6)})
        </div>
        <div className="panel-body">
          <div className="container-fluid">
            <div className="row">
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-2 control-label">Name</label>
                  <div className="col-sm-10">
                    <p class="form-control-static">{this.props.name}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Type</label>
                  <div className="col-sm-10">
                    <p class="form-control-static">{this.props.type}</p>
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
export default Site;