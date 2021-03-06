// Carregando módulos
const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("../config/auth")(passport);
const moment = require('moment');
moment().format();

// Configurações 
// Template engine
const exphbs = handlebars.create({
  helpers: {
    // Helper utilizado para formatar as datas, exemplo: 2021-12-20 12:18
    formatDate: function (datetime, format) {
      // Helper retirado de: https://stackoverflow.com/questions/18580495/format-a-date-from-inside-a-handlebars-template-in-meteor
      if (datetime == null) {
        return "";
      }

      if (moment) {
        format = 'YYYY-MM-DD HH:mm:ss'
        return moment(datetime).format(format);
      }
      else {
        return datetime;
      }
    },
    selected: function (idOpcao, idFiltros, options) {
      if (idOpcao == idFiltros) {

        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    calculaTempo: function (inicio, fim) {
      // Retirado de: https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates
      if (fim == null) {
        return ""
      }
      var dateFuture = new Date(fim);
      var dateNow = new Date(inicio);

      var seconds = Math.floor((dateFuture - (dateNow)) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);

      hours = hours - (days * 24);
      minutes = minutes - (days * 24 * 60) - (hours * 60);
      seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

      return hours + ":" + minutes + ":" + seconds
    }
  },
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