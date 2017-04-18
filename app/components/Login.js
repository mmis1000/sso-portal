import React from 'react';
import AppActions from '../actions/AppActions'
import AppStore from '../stores/AppStore';

class Login extends React.Component {
  constructor() {
    super();
    this.onLogin = this.onLogin.bind(this);
    this.inputEmail = null;
    this.inputPassword = null;
  }
  
  componentDidMount() {
    if (AppStore.getState().logined) {
      browserHistory.replace("/DashBoard")
    }
  }
  
  onLogin(e) {
    e.preventDefault();
    console.log(this.inputEmail.value, this.inputPassword.value);
    AppActions.doEmailLogin(this.inputEmail.value, this.inputPassword.value)
  }
  
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-sm-8 col-sm-offset-2'>
            
            <div className="panel panel-default">
              <div className="panel-heading">Please Login</div>
              <div className="panel-body">
                
                <form className="form-horizontal" onSubmit={this.onLogin}>
                  <div className="form-group">
                    <label htmlFor="inputEmail" className="col-sm-2 control-label">Email</label>
                    <div className="col-sm-10">
                      <input type="email" className="form-control" id="inputEmail" placeholder="example@example.com" ref={(inputEmail) => this.inputEmail = inputEmail}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputPassword" className="col-sm-2 control-label">Password</label>
                    <div className="col-sm-10">
                      <input type="password" className="form-control" id="inputPassword" placeholder="Password" ref={(inputPassword) => this.inputPassword = inputPassword}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-4 col-sm-offset-8">
                      <button className="btn btn-block btn-success">Login</button>
                    </div>
                  </div>
                </form>
                
                <hr/>
                
                <div className="row">
                  <div className="col-xs-4">
                    or login via...
                  </div>
                  <div className="col-xs-4">
                    <button className="btn btn-block btn-primary">github</button>
                  </div>
                  <div className="col-xs-4">
                    <button className="btn btn-block btn-primary">google</button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Login;