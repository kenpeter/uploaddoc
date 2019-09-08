const bodyParser = require('body-parser');
const serve = require('express-static');

// normal route
const build = require('./route.js');

// build route
const server = build();

// user body parser
server.use(bodyParser);
server.use(serve(__dirname + '/public'));

// custom port
const port = process.argv[2];

// listen
server.listen(port);
console.log('listen: ', port);
