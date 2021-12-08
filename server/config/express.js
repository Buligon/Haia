// Carregando módulos
const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const session = require("express-session");
const flash = require("connect-flash");

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
      secret: "@ifpr#s3ss10n",
      resave: true,
      saveUninitialized: true
    }));
    app.use(flash());
  // Middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash("succes_msg");
      res.locals.erro_msg = req.flash("error_msg");
      next();
    })
  // Public 
  var assetsPath = path.join(__dirname, '../public');
  app.use(express.static(assetsPath));

module.exports = app