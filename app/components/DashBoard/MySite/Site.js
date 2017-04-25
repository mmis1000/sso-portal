import React from 'react';
import AppStore from '../../../stores/AppStore'

class Site extends React.Component {
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
                {
                  this.props.type === "static" ?
                  <div className="form-group">
                    <div className="col-sm-12">
                      <pre>
                          {
`
    location / {
        auth_request /auth;
                
        auth_request_set $sso_login_token $upstream_http_sso_login_token;
        auth_request_set $sso_session $upstream_http_sso_session;
        
        add_header set-cookie "sso_session=$sso_session; Max-Age=86400; Path=/";
        
        error_page 401 = "/auth_fail_\${sso_login_token}_\${sso_session}";

        proxy_pass http://example.com;
    }
        
    location ~ /auth_fail_([^_]*)_([^_]*) {
        internal;
        set $sso_login_token $1;
        set $sso_session $2;
        
        if ($sso_session) {
             add_header set-cookie "sso_session=$sso_session; Max-Age=86400; Path=/";
        }
       
        return 302 ${domain.replace(/\/$/, '')}/Login?redirect=${encodeURIComponent(this.props.entry)}&sso_token=\${sso_login_token};
    }

    location = /auth {
        internal;

        proxy_pass ${domain.replace(/\/$/, '')}/api/sso/check/${this.props.id};
        proxy_pass_request_body     off;
        proxy_set_header X-Original-URI $request_uri;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Content-Length "";
         
        proxy_cache sso_session;
        proxy_cache_valid  200 1h;
        proxy_cache_valid  any 0;
        proxy_cache_key "\${cookie_sso_session}";
    }
`
                          }
                      </pre>
                    </div>
                  </div>:
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