// Carregando módulos
const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("../config/auth")(passport);

// Configurações 
  // Template engine
    const exphbs = handlebars.create({
      extname: '.hbs'
    });
    app.engine('.hbs', exphbs.engine);
    app.set('view engine', '.hbs');

  // Body Parser
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

  // Sessão
    app.use(session({
      secret: "HQh%k%r*2yZn",
      resave: true,
      saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());
  // Middleware
    app.use((req, res, next) => {
      
      res.locals.success_msg = req.flash("succes_msg");
      res.locals.error_msg = req.flash("error_msg");
      res.locals.error = req.flash("error");
      res.locals.user = req.user || null;
      next();

    })
  // Public 
  var assetsPath = path.join(__dirname, '../public');
  app.use(express.static(assetsPath));

module.exports = app