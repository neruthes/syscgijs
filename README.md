# syscgijs

## Abstract

This is an early WIP demo.

This program is a CGI middleware. This program will start a webserver.
When a request comes, the webserver will execute a program (with the URL as an environment variable)
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
        proxy_set_header cmdline '/usr/bin/node /home/neruthes/DEV/coolaltindex/coolaltindex.js';
        proxy_set_header wwwroot $document_root;
        proxy_pass http://127.0.0.1:9234;
    }
}
```

Only `cmdline` is required. Others are optional, depending on the specific programs you invoke.

## Known Issues

- Nodejs cannot handle UTF-8 properly outside `req.url`, like in `req.headers`.


## Copyright

Copyright (c) 2022 Neruthes.

Published with GNU GPLv2.
