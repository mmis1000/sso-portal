import alt from '../alt';

class SiteActions {
  constructor() {
    this.generateActions(
      'siteLoad',
      'siteUpdate',
      'siteAdd',
      'siteRemove'
    );
  }
  
  loadSites() {
    $.ajax({ url: '/api/admin/site'})
    .done((data) => {
      this.siteLoad(data)
    })
    .fail((jqXhr) => {
      toastr.warning('failed to load site due to some error')
    });
    return true;
  }
  
  addSite(name, type, entry) {
    // console.log("add site");
    // this.siteAdd({id: '' + Math.random(), name, type})
    $.ajax({ url: '/api/admin/site/add', method: 'POST', data: {
      name, type, entry
    }})
    .done((data) => {
      this.siteAdd(data)
    })
    .fail((jqXhr) => {
      toastr.warning('failed to add site due to some error')
    });
    return true;
  }
  
  updateSite(id, name, type, entry) {
    // this.siteUpdate({id, name, type})
    // return true;
    
    $.ajax({ url: '/api/admin/site/update', method: 'POST', data: {
      id, name, type, entry
    }})
    .done((data) => {
      this.siteUpdate(data)
    })
    .fail((jqXhr) => {
      toastr.warning('failed to update site due to some error')
    });
    return true;
  }
  
  removeSite(id) {
    // this.siteRemove({id: id})
    // return true;
    
    $.ajax({ url: '/api/admin/site/remove', method: 'POST', data: {
      id
    }})
    .done((data) => {
      this.siteRemove({id: id})
    })
    .fail((jqXhr) => {
      toastr.warning('failed to remove site due to some error')
    });
    return true;
  }
  
}

export default alt.createActions(SiteActions);