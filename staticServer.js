var express = require('express');
var http = require('http');

function startServer() {
    const httpPort = process.argv[3] || 2338;
    const folder = process.argv[2] || 'build';

    const app = express();
    const absFolder = __dirname + '/' + folder;
    app.use('/', express.static(absFolder));

    http.createServer(app).listen(httpPort);

    console.log(`serving folder '${absFolder}' on port: ${httpPort}`);
}

startServer();