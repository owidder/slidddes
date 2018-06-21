var express = require('express');
var http = require('http');

const commandServer = require('./serverSrc/slidddes/commandServer');


function startServer() {
    const wsPort = process.argv[4] || 2337;
    const httpPort = process.argv[3] || 2338;
    const folder = process.argv[2] || 'build';

    const app = express();
    const absFolder = __dirname + '/' + folder;
    app.use('/', express.static(absFolder));

    http.createServer(app).listen(httpPort);

    console.log(`serving folder '${absFolder}' on port: ${httpPort}`);

    commandServer.startNew(wsPort);
}

startServer();