var proxy = require('http-proxy-middleware');

// var url = 'http://172.10.10.128:22301';
var url = 'http://172.10.10.120:24001/rest-web';


module.exports = [
    proxy('/common/**/*',  {target: url,changeOrigin:true}),
    proxy('/web/**/*',  {target: url,changeOrigin:true}),
];