import alt from '../alt';

class UserActions {
  constructor() {
    this.generateActions(
      'userLoad',
      'userUpdate',
      'userRemove'
    );
  }
  
  loadUsers() {
    /*this.userLoad([
      {
        id: "000000",
        username: "fake user",
        sites: ["58fa413e75d6fb64a23a0fa4"]
      }
    ])*/
    
    
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
    $.ajax({ url: '/api/admin/user/update', method: 'POST',
      dataType: 'json', 
      contentType : 'application/json',
      data: JSON.stringify({
        id, username, isAdmin, sites, setting
      })
    })
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
      this.userRemove({id})
    })
    .fail((jqXhr) => {
      toastr.warning('failed to remove user due to some error')
    });
    return true;
  }
  
}

export default alt.createActions(UserActions);