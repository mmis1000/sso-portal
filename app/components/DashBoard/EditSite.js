import React from 'react';
import { Link } from 'react-router-dom'
import Site from './EditSite/Site'
import AddSite from './EditSite/AddSite'
import SiteStore from '../../stores/SiteStore'
import SiteActions from '../../actions/SiteActions'

class EditSite extends React.Component {
  constructor () {
    super();
    this.onChange = this.onChange.bind(this);
    this.addSite = this.addSite.bind(this);
    this.updateSite = this.updateSite.bind(this);
    this.removeSite = this.removeSite.bind(this);
    this.state = SiteStore.getState();
  }
  
  componentDidMount() {
    SiteStore.listen(this.onChange);
    SiteActions.loadSites()
  }
  
  componentWillUnmount() {
    SiteStore.unlisten(this.onChange);
  }
  
  onChange(state) {
    this.setState(state);
  }
  
  addSite(name, type, entry) {
    SiteActions.addSite(name, type, entry)
  }
  
  updateSite(id, name, type, entry) {
    SiteActions.updateSite(id, name, type, entry)
  }
  
  removeSite(id) {
    SiteActions.removeSite(id)
  }
  
  render(){
    return (
      <div>
        {
          this.state.sites.map((site)=>{
            console.log(site.id + "-" + site.__rev)
            return <Site key={site.id + "-" + site.__rev} updateSite={this.updateSite} siteRemove={this.removeSite} {...site}/>
          })
        }
        <AddSite addSite={this.addSite}/>
      </div>
    );
  }
}
export default EditSite;