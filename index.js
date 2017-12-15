const express = require('express');
const kraken = require('kraken-js');
const path = require('path');
const enrouten = require('express-enrouten');
const mongoose = require('mongoose');
const config = require('./config.json');
const session = require('express-session');
const mongoUrl = 'mongodb://' + config.username + ':' + config.password + '@ds141766.mlab.com:41766/uteach';

const app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// database
mongoose.connect(mongoUrl, { useMongoClient: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// middleware
// dynamic routing
app.use(enrouten({}));
// session
app.use(session({
  secret: 'uteach',
  resave: true,
  saveUninitialized: false
}));
// Release the Kraken
app.use(kraken({
  onconfig: function (config, next) {
    /*
     * Add any additional config setup or overrides here. `config` is an initialized
     * `confit` (https://github.com/krakenjs/confit/) configuration object.
     */
    next(null, config);
  }
}));

app.on('start', function () {
  console.log('Application ready to serve requests.');
  console.log('Environment: %s', app.kraken.get('env:env'));
});

process.on('exit', function() {
  db.close();
});