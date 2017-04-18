import React from 'react';
import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';
import Nav from './Nav'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = AppStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AppStore.listen(this.onChange);
    AppActions.checkLogin();
  }
  
  componentWillUnmount() {
    AppStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }
  
  render() {
    return (
      <div>
        <Nav />
        { this.props.children }
      </div>
    );
  }
}

export default App;