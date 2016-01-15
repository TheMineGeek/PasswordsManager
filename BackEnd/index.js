'use strict'

/** Components */

var restify = require('restify');
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var fs = require('fs');

/** Env var */

var crypto_config = {
  algorithm: 'aes-256-ctr'
};

var jwt_config = {
  cert: fs.readFileSync('./certs/passwordManager.key'),
  pubkey: fs.readFileSync('./certs/pubkey.pem'),
  algorithm: 'RS512',
  pass: 'randomString',
  expiresIn: '12h'
};

/** Mongoose models */

var User = require('./models/User');
var Password = require('./models/Password');

/** Resitfy conf */

var app = restify.createServer();

app.use(restify.queryParser());
app.use(restify.bodyParser());

/** Mongo connection */

mongoose.connect('mongodb://localhost:27017/passwordManager');

/** Routes */
app.post('/user', function (req, res) {
  var _password = encrypt(req.params.password, req.params.password);

  var user = new User({
    username: req.params.username,
    password: _password
  });
  User.count({ username: req.params.username }, function (err, count) {
    if (err) throw err;
    if (count === 0) {
      user.save(function (err) {
        if (err) throw err;

        res.send('User saved');
      });
    }
    else {
      res.send('Username already used');
    }
  });
});

app.post('/connect', function (req, res) {
  User.findOne({ username: req.params.username }, function (err, el) {
    if (err) throw err;

    if (el) {
      if (req.params.password == decrypt(el.password, req.params.password)) {
        var obj = {
          username: el.username,
          password: req.params.password,
          _id: el._id
        };

        if (jwt_config.cert != '') {
          jwt.sign(obj, jwt_config.cert, { algorithm: jwt_config.algorithm }, function (token) {
            res.json({ token: token });
          });
        }
        else {
          jwt.sign(obj, jwt_config.pass, { algorithm: jwt_config.algorithm }, function (token) {
            res.json({ token: token });
          });
        }
      }
    }
    else {
      res.send(401);
    }
  });
});

app.put('/password', function (req, res) {
  var token = req.params.token;

  jwt.verify(token, jwt_config.pubkey, { algorithms: [jwt_config.algorithm] }, function (err, decoded) {
    if (err) throw err;
    console.log(decoded); // bar
    res.send(decoded);
  });

});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('L\'api écoute sur http://%s:%s', host, port);
});





/* USUAL FUNCTIONS */

function encrypt(text, password) {
  var cipher = crypto.createCipher(crypto_config.algorithm, password.toString('binary'));
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text, password) {
  var decipher = crypto.createDecipher(crypto_config.algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}