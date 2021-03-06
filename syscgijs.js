#!/usr/bin/node

const fs = require('fs');
const http = require('http');
const sh = require('child_process').execSync;


// Load configuration
let CONFIG = {
    timeout: 500
};
const configPath = `/etc/syscgijs/config.json`;
if (fs.existsSync(configPath)) {
    realConfig = fs.readFileSync(configPath);
    Object.keys(realConfig).map(function (keyname) {
        CONFIG[keyname] = realConfig[keyname];
    });
};


console.log(`Server starting.`);

http.createServer(function (req, res) {
    let reqBodyData = '';
    req.on('data', function (chunk) {
        reqBodyData += chunk;
    });
    req.on('end', function () {
        // Actually do things here
        const cmdline = req.headers.cmdline;
        const wwwroot = req.headers.wwwroot;
        const programPath = cmdline.split(' ')[0];
        try {
            // Inherit env from env and http request headers
            let localEnv = JSON.parse(JSON.stringify(process.env));
            localEnv.url = req.url;
            localEnv.wwwroot = wwwroot;
            localEnv.reqBodyData = reqBodyData;
            console.log(`localEnv.url: ${localEnv.url}`);
            console.log(`localEnv.wwwroot: ${localEnv.wwwroot}`);
            console.log('-------');

            // Give response
            try {
                res.writeHead(200, {
                    'content-type': req.headers.restype || 'text/plain'
                });
                const stdout = sh(`${cmdline}`, {
                    cwd: '/tmp',
                    env: localEnv,
                    input: reqBodyData,
                    timeout: req.headers.syscgi_timeout || CONFIG.timeout || 1000
                }).toString();
                res.end(stdout);
                console.log('stdout');
                console.log(stdout);
                console.log('------------------------------');
                return 0;
            } catch (e) {
                // Any handling?
                console.log(e);
                res.writeHead(503);
                res.end(`503: Service Temporarily Unavailable : ${JSON.stringify(e, '\t', 4)}`);
                res.end(`503: Service Temporarily Unavailable : ${e.stdout.data.toString()}`);
            };
        } catch (e) {
            res.writeHead(500);
            res.end(`500: Server Internal Error`);
        };
    });
}).listen(9234, '127.0.0.1');
