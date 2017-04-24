import alt from '../alt';
import QueryString from '../utils/QueryString'
class AppActions {
  constructor() {
    this.generateActions(
      'domainName',
      'pathChange',
      'loginStatusSuccess',
      'loginStatusFail',
      'searchChange'
    );
  }
  
  setDomain(domain) {
    this.domainName(domain)
    return true;
  }
  
  checkLogin() {
    $.ajax({ url: '/api/auth/login_status' })
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
      url: '/api/auth/email/json' ,
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
      url: '/api/auth/logout' 
    })  
    .done((msg)=>{
      this.loginStatusFail();
      browserHistory.push('/Login');
    });
    return true;
  }
  
  updatePath() {
    this.pathChange(browserHistory.location.pathname);
    this.searchChange(QueryString(browserHistory.location.search.slice(1)))
    return true;
  }
}

export default alt.createActions(AppActions);