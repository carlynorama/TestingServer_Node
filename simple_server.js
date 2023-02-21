// 20 Feb 2023 - @todbot / Tod Kurt, for carlynorama
// orig from: https://web.dev/eventsource-basics/
// 21 Feb 2023 modifications carlynorama
// based on: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework

var http = require('http');
var fs = require('fs');
var path = require('path');
//import * as path from 'node:path';

var http_port =  8000

const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
  };

const toBool = [() => true, () => false];

const STATIC_PATH = path.join(process.cwd(), './static');

  const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];
    if (url.endsWith('/')) paths.push('index.html');
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : STATIC_PATH + '/404.html';
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
  };

console.log("starting server on port "+http_port)

http.createServer(async function(req, res) {
    if (req.headers.accept
        && req.headers.accept == 'text/event-stream'
       ) {
        if (req.url == '/events') {
            sendSSE(req, res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else {
        if (req.url == '/large_file.png') {
            const file = await prepareFile(req.url);
            const statusCode = file.found ? 200 : 404;
            const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
            res.writeHead(statusCode, { 'Content-Type': mimeType });
            file.stream.pipe(res);
            console.log(`${req.method} ${req.url} ${statusCode}`);
        }
    }
}).listen(http_port);

function sendSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // Sends a SSE every 2 seconds on a single connection.
    setInterval(function() {
        var id = (new Date()).toLocaleTimeString();
        var event_type = 'update'
        var data_str = '{"time":"'+ (new Date()).toLocaleTimeString() + '"}'
        constructSSE(res, id, event_type, data_str )
    }, 2000);
}

function constructSSE(res, id, event_type, data) {
    //res.write('id: ' + id + '\n');
    res.write('event: ' + event_type + '\n');
    res.write("data: " + data + '\n\n');
}