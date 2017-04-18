import React from 'react';
import AppStore from '../stores/AppStore';
import { Link } from 'react-router-dom'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = AppStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AppStore.listen(this.onChange);
  }
  
  componentWillUnmount() {
    AppStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-sm-8 col-sm-offset-1'>
            <h1> Hello { this.state.logined ?  this.state.user.username : 'Guest' }! </h1>
            {this.state.logined ? "Welcome back!" : <Link to="/Login">Click here to login.</Link>}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;