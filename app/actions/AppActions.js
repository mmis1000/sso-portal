import alt from '../alt';

class AppActions {
  constructor() {
    console.log('called');
    this.generateActions(
      'pathChange',
      'loginStatusSuccess',
      'loginStatusFail'
    );
    console.log(this.actions);
  }
  
  checkLogin() {
    $.ajax({ url: '/api/login_status' })
      .done((data) => {
        this.loginStatusSuccess(data)
      })
      .fail((jqXhr) => {
        this.loginStatusFail(jqXhr)
      });
    return true;
  }
  
  doEmailLogin(email, password) {
    $.ajax({ 
      method: 'POST',
      url: '/api/login/email' ,
      data: {email, password}
    })  
    .done((msg)=>{
      this.loginStatusSuccess(msg);
      browserHistory.push('/DashBoard');
    })
    .fail(()=>{
      toastr.warning('Wups, it seems their is some error with passowrd or email?')
    });
    return true;
  }
  
  doLogout() {
    $.ajax({ 
      method: 'POST',
      url: '/api/logout' 
    })  
    .done((msg)=>{
      this.loginStatusFail();
      browserHistory.push('/Login');
    });
    return true;
  }
  
  updatePath() {
    this.pathChange(browserHistory.location.pathname);
    return true;
  }
}

export default alt.createActions(AppActions);