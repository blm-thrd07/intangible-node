
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

/* API AUTH */
app.all('/*', function(req, res, next) {
  //IRL, lookup in a database or something
  if (typeof req.headers['x-api-key'] !== 'undefined' && req.headers['x-api-key'] === 'lnx1337') {
    next();
  }else {
    res.status(401).send({error: "Bad or missing app identification header"});
  }
});


/* API USERS */

/* RESTFUL API */
app.get('/db',user.db);
app.post('/users/login',user.login);
app.get('/users/list', user.list);
app.post('/users/add',user.create);
app.put('/users/edit/:id',user.update);
app.get('/users/:id',user.view);
app.delete('/users/:id',user.delete);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});