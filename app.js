var express = require('express');
var app = express();
var session = require('client-sessions');
var model = require('./model/index');

var Promise = require('bluebird');

app.use(express.static(__dirname + '/public'));

app.use(session({
  cookieName: 'session',
  secret: 'flibble-bibble!!¬!£%5135n1ln1%5hh53wrb"aMvdG$v"NGINRVALWIRNVLIWANRVa',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

var Presenter = require('yayson')({adapter: 'sequelize'}).Presenter;

var UsersPresenter = function (scope) { Presenter.call(this, scope); };
UsersPresenter.prototype = new Presenter();
UsersPresenter.prototype.type = 'users';

var DebtsPresenter = function (scope) { Presenter.call(this, scope); };
DebtsPresenter.prototype = new Presenter();
DebtsPresenter.prototype.type = 'debts';

UsersPresenter.prototype.relationships = () => {
  return {
    From: DebtsPresenter,
    To: DebtsPresenter
  };
};

DebtsPresenter.prototype.relationships = () => {
  return {
    From: UsersPresenter,
    To: UsersPresenter
  };
};

app.post('/login', function(req, res) {
  model.User.findOne({ email: req.body.email }).then(user => {
    //The password is always magically right.  You're a wizard, Harry.
    req.session.user = user;
    res.redirect('/debts');
  });
});

app.get('/api/user/:id', Promise.coroutine(function*(req, res) {
  var currentUserId = getCurrentUserId(session);
  jsonApi(res, yield getUser(req.params.id, currentUserId), new UsersPresenter());
}));

app.get('/api/debt/:id', Promise.coroutine(function*(req, res) {
  var currentUserId = getCurrentUserId(session);
  if (currentUserId) {
    jsonApi(res, yield getDebt(req.params.id, currentUserId), new DebtsPresenter());
  } else {
    //TODO: send error response
  }
}));

function getCurrentUserId(session) {
  //TODO: hard-coded logged-in user
  return 2;
  
  if (session && session.user) {
    return session.user.id;
  } else {
    //TODO: what is a more sensible way to handle not logged in unavoidably? Throw an error?
    return null;
  }
}

function jsonApi(res, obj, presenter) {
  res.setHeader('Content-Type', 'application/vnd.api+json');
  // console.log(JSON.stringify(obj));
  var a = presenter.render(obj)
  res.send(a);
}

function getDebt(id, currentUser) {
  return model.Debt.findById(id, {
    //Restrict to debts this user is a participant in
    where: { $or: [ { FromId: currentUser }, { ToId: currentUser } ] },
    include: [{ model: model.User, as: 'From' }, { model: model.User, as: 'To' } ]
  });
}

function getUser(id, currentUser) {
  //Only allow users to see details of debts they're participants in.
  return model.User.findById(id, {
    include: [{
        model: model.Debt,
        as: 'From',
        where: { [id == currentUser ? 'FromId' : 'ToId']: currentUser },
        required: false
      }, {
        model: model.Debt,
        as: 'To', 
        where: { [id == currentUser ? 'ToId' : 'FromId']: currentUser },
        required: false
      }
    ]
  });
}

app.use(express.static('client'));
app.listen(process.env.PORT);