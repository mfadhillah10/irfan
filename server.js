var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000,
    bodyParser = require('body-parser');

var morgan = require('morgan');
var logger = require("./util/logging/winston-logger");

app.use(morgan('combined',{ "stream": logger.stream }));
logger.debug("Overriding 'Express' logger");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var accountRouter = require('./routes/routes-account');
accountRouter(app);

var customerRoutes = require('./routes/routes-customer');
customerRoutes(app);
var transactionRoutes = require('./routes/routes-transaction');
transactionRoutes(app);

app.listen(port);
console.log('RESTful API server started on: ' + port);