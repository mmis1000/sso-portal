import React from 'react';
import { Link } from 'react-router-dom'
import Site from './MySite/Site'
import SiteStore from '../../stores/SiteStore'
import AppStore from '../../stores/AppStore'
import SiteActions from '../../actions/SiteActions'

class MySite extends React.Component {
  constructor () {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = Object.assign(
      {},
      SiteStore.getState(),
      AppStore.getState()
    )
  }
  
  
  componentDidMount() {
    SiteStore.listen(this.onChange)
    AppStore.listen(this.onChange)
    SiteActions.loadSites();
  }
  
  componentWillUnmount() {
    SiteStore.unlisten(this.onChange)
    AppStore.unlisten(this.onChange)
  }
  
  onChange(state) {
    this.setState(state);
  }
  
  render(){
    return (
      <div className="list-group">
        {
          this.state.user.sites.filter((id)=>{
            return this.state.sites.map((i)=>i.id).indexOf(id) >= 0
          })
          .map((site)=>{
            return this.state.sites.find((i)=>i.id === site)
          })
          .map((site)=>{
            return <Site key={site.id} {...site}/>
          })
        }
        <div className="panel panel-default">
          <div className="panel-heading clearfix">
            nginx proxy setting
          </div>
          <div className="panel-body">
            <pre>
              proxy_cache_path /usr/local/nginx/proxy_cache levels=1:2 keys_zone=sso_session:20m inactive=1d max_size=100m;
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
export default MySite;