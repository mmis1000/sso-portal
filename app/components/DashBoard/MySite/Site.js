import React from 'react';
import AppStore from '../../../stores/AppStore'

var getStaticSiteText = (domain, entry, id)=>{
  var secureFlag = domain.slice(0, 5) === "https" ? "; Secure" : "";
  return `    location / {
        auth_request /auth;
                
        auth_request_set $sso_login_token $upstream_http_sso_login_token;
        auth_request_set $sso_session $upstream_http_sso_session;
        auth_request_set $auth_cache_status $upstream_cache_status;
        
        add_header set-cookie "sso_session=$sso_session; Max-Age=86400; Path=/; HttpOnly${secureFlag}";
        add_header X-Auth-Cache-Status $auth_cache_status;
        
        error_page 401 = "/auth_fail_\${sso_login_token}_\${sso_session}";

        proxy_pass http://example.com;
    }
        
    location ~ /auth_fail_([^_]*)_([^_]*) {
        internal;
        set $sso_login_token $1;
        set $sso_session $2;
        
        add_header set-cookie "sso_session=$sso_session; Max-Age=86400; Path=/; HttpOnly${secureFlag}";
        
        proxy_pass ${domain.replace(/\/$/, '')}/api/sso/secure_redirect/${id}?redirect=${encodeURIComponent(entry)}&sso_token=\${sso_login_token};
    }

    location = /auth {
        internal;

        proxy_pass ${domain.replace(/\/$/, '')}/api/sso/check/${id};
        proxy_pass_request_body off;
        proxy_set_header X-Original-URI $request_uri;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Content-Length "";
         
        proxy_cache sso_session;
        proxy_cache_valid  200 1h;
        proxy_cache_valid  any 0;
        proxy_cache_key "\${cookie_sso_session}";
    }`
}

class Site extends React.Component {
  constructor() {
    super();
    this.state = {hidden: true};
    this.toggle = this.toggle.bind(this);
  }
  
  toggle(e) {
    e.preventDefault();
    this.setState({hidden: !this.state.hidden});
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.__rev !== this.props.__rev) {
      this.setState(this.state);
    }
  }
  
  render() {
    var domain = AppStore.getState().domain;
    
    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
          {this.props.name} ({this.props.id.slice(0, 6)})
        </div>
        <div className="panel-body">
          <div className="container-fluid">
            <div className="row">
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-2 control-label">Name</label>
                  <div className="col-sm-10">
                    <p className="form-control-static">{this.props.name}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Type</label>
                  <div className="col-sm-10">
                    <p className="form-control-static">{this.props.type}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Entry</label>
                  <div className="col-sm-10">
                    <p className="form-control-static">{this.props.entry}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Domain</label>
                  <div className="col-sm-10">
                    <p className="form-control-static">{this.props.domain}</p>
                  </div>
                </div>
                {
                  !this.props.type === "static" || this.state.hidden 
                  ?
                    ""
                  :
                    <div className="form-group">
                      <div className="col-sm-12">
                        <pre>{/*
                     */}{ getStaticSiteText(domain, this.props.entry, this.props.id) }{/*
                     */}</pre>
                      </div>
                    </div>
                }
                {
                  this.props.type === "static" 
                  ?
                    <button onClick={this.toggle} className="btn btn-default">
                    {
                      this.state.hidden
                      ?
                        "Show proxy setting"
                      :
                        "Hide proxy setting"
                    }
                    </button>
                  :
                    ""
                }
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Site;