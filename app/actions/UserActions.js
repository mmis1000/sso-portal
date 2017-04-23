import alt from '../alt';

class AppActions {
  constructor() {
    this.generateActions(
      'userLoad',
      'userUpdate',
      'userRemove'
    );
  }
  
  loadUsers() {
    $.ajax({ url: '/api/admin/user'})
    .done((data) => {
      this.userLoad(data)
    })
    .fail((jqXhr) => {
      toastr.warning('failed to load user due to some error')
    });
    return true;
  }
  
  updateUser(id, username, isAdmin, sites, setting) {
    $.ajax({ url: '/api/admin/user/update', method: 'POST', data: {
      id, username, isAdmin, sites, setting
    }})
    .done((data) => {
      this.userUpdate(data)
    })
    .fail((jqXhr) => {
      toastr.warning('failed to update user due to some error')
    });
    return true;
  }
  
  removeUser(id) {
    $.ajax({ url: '/api/admin/user/remove', method: 'POST', data: {
      id
    }})
    .done((data) => {
      this.userRemove({id: id})
    })
    .fail((jqXhr) => {
      toastr.warning('failed to remove user due to some error')
    });
    return true;
  }
  
}

export default alt.createActions(AppActions);