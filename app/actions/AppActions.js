import alt from '../alt';
import QueryString from '../utils/QueryString'
class AppActions {
  constructor() {
    this.generateActions(
      'domainName',
      'pathChange',
      'loginStatusSuccess',
      'loginStatusFail',
      'searchChange',
      'newMessage',
      'emptyMessage'
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
  
  
  inform(level, text, redirect) {
    if (level === 'error') {
      toastr.error(text)
    }
    if (level === 'warning') {
      toastr.warning(text)
    }
    if (level === 'info' || level === 'success') {
      toastr.success(text)
    }
    if (redirect) {
      this.doRedirect(redirect)
    }
    return true;
  }
  
  addMessage(message) {
    this.newMessage(message);
    return true;
  }
  
  addMessages(messages) {
    messages.forEach((message)=>{
      this.addMessage(message);
    })
    return true;
  }
  
  clearMessage() {
    this.emptyMessage();
    return true;
  }
  
  doRedirect(redirect, delay) {
    setTimeout(() => {
      browserHistory.replace(redirect);
    }, delay || 0)
    return true;
  }
}

export default alt.createActions(AppActions);