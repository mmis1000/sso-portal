import alt from '../alt';
import SiteActions from '../actions/SiteActions';

class SiteStore {
  constructor() {
    this.bindActions(SiteActions);
    this.state = {
      sites: []
    }
  }
  
  onSiteLoad(sites) {
    sites.forEach(function (site) {
      site.__rev = 0;
    })
    this.setState({sites});
  }
  
  onSiteUpdate(newSite) {
    var newSites = this.state.sites.slice(0);
    newSites = newSites.map(function (site) {
      if (site.id !== newSite.id) {
        return site
      } else {
        newSite.__rev = site.__rev + 1;
        return newSite;
      }
    })
    this.setState({sites: newSites});
  }
  
  onSiteAdd(newSite) {
    newSite.__rev = 0;
    var newSites = this.state.sites.slice(0);
    newSites.push(newSite);
    this.setState({sites: newSites});
  }
  
  onSiteRemove(siteToRemove) {
    var newSites = this.state.sites.slice(0);
    newSites = newSites.filter((site)=> site.id !== siteToRemove.id)
    this.setState({sites: newSites});
  }
}
export default alt.createStore(SiteStore);