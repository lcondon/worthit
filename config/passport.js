const session = require('express-session');
const cookieparser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const db = require('../models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

module.exports = function (app) {
  const myStore = new SequelizeStore({
    db: db.sequelize,
    table: 'Sessions'
  });
  app.use(cookieparser());
  app.use(session({
    secret: 'keyboard cat',
    store: myStore,
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true,
    saveUninitialized: false,
    rolling: true,
    name: 'sid',
    cookie: {
      httpOnly: true,
      maxAge: 20 * 60 * 1000, // 20 minutes
    }
  }));
  app.use(flash());

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.User.findById(id).then(function (user) {
      done(null, user);
    }).catch(done);
  });

  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
    function (email, password, done) {
      db.User.findOne({ where: { email: email } }).then(function (user, err) {
        var creds = user.dataValues;
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (user){
          if (password === creds.password){
            return done(null, user);
          } else {
            return done(null, false, { msg: 'Invalid password.' });
          }
        };
      });
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());

}