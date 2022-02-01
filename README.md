# syscgijs

## Abstract

This is an early WIP demo.

This program is a CGI middleware. This program will start a webserver.
When a request comes, the webserver will execute a program (with the search query as environment variables and the request body as `stdin`)
and pass the `stdout` as the response.


## Working Scenario

A desirable scenario is to use this as a generic CGI gateway for Nginx.

Suppose that a syscgijs progress is listening at port 9234.

```
server {
    listen 80;
    server_name nas.ndlt6g.lan;
    location / {
        root /srv/myNAS;
    }
    location ~ /$ {
        proxy_set_header src_uri $uri;
        proxy_set_header request_filename $request_filename;
        proxy_pass http://127.0.0.1:9234/usr/local/bin/nginxAltIndex;
    }
}
```