import fs from 'fs';
import http from 'http';
import url from 'url';

const hostname = '127.0.0.1';
const port = 3003;

const server = http.createServer((request, response) => {
    const path = url.parse(request.url).pathname;
    let content = '';

    switch (path) {
    case '/':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        content = fs.readFileSync('client/index.html', 'utf8');
        console.log('HTTP', response.statusCode, request.url);
        break;
    case '/index.js':
    case '/board.js':
    case '/console.js':
    case '/piece.js':
    case '/score.js':
    case '/square.js':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/javascript');
        content = fs.readFileSync('client' + path, 'utf8');
        break;
    case '/main.css':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/css');
        content = fs.readFileSync('client' + path, 'utf8');
        break;
    case '/img/404.jpg':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/jpeg');
        content = fs.readFileSync('client' + path);
        break;
    case '/img/board-120.png':
    case '/img/board-128.png':
    case '/img/board-152.png':
    case '/img/board-167.png':
    case '/img/board-180.png':
    case '/img/board-192.png':
    case '/img/icons8-pawn-ios-16-16.png':
    case '/img/icons8-pawn-ios-16-32.png':
    case '/img/icons8-pawn-ios-16-57.png':
    case '/img/icons8-pawn-ios-16-60.png':
    case '/img/icons8-pawn-ios-16-70.png':
    case '/img/icons8-pawn-ios-16-72.png':
    case '/img/icons8-pawn-ios-16-76.png':
    case '/img/icons8-pawn-ios-16-96.png':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/png');
        content = fs.readFileSync('client' + path);
        break;
    case '/apple-touch-icon.png':
        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/png');
        content = fs.readFileSync('client/img' + path);
        break;
    default:
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html');
        content = fs.readFileSync('client/404.html', 'utf8');
        console.log('HTTP', response.statusCode, request.url);
        break;
    }

    response.setHeader('Content-Length', Buffer.byteLength(content));
    response.setHeader('Expires', new Date().toUTCString());
    response.end(content);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
