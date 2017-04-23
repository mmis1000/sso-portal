import React from 'react';
import { Link } from 'react-router-dom'
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';
import AppActions from '../actions/AppActions';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
  }
  
  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    console.log(state)
    this.setState(state);
  }
  
  onLogout() {
    AppActions.doLogout();
  }
  
  render() {
    return (
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">Mmis sso {/*JSON.stringify(this.state)*/}</Link>
          </div>
          <ul className="nav navbar-nav">
            <li className={this.state.path === "/" ? "active" : ""}><Link to="/">Home</Link></li>
          </ul>
          {
            this.state.logined 
            ?
            [<ul className="nav navbar-nav" key="DashBoard">
              <li className={this.state.path.indexOf("/DashBoard") === 0 ? "active" : ""}><Link to="/DashBoard">DashBoard</Link></li>
            </ul>,
            <ul className="nav navbar-nav navbar-right" key="/LogOut">
              <li><a onClick={this.onLogout}>log out</a></li>
            </ul>]
            :
            <ul className="nav navbar-nav navbar-right">
              <li className={this.state.path === "/Login" ? "active" : ""}><Link to="/Login">Login</Link></li>
            </ul>
          }
        </div>
      </nav>
    );
  }
}

export default Nav;