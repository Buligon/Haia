const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database.js");
const passport = require("passport");
const { autenticado } = require("../helpers/validaAutenticacao.js");

router.get('/', (req, res) => {
  res.render('login', {
    style: 'styles.css'
  });
});

router.post('/', (req, res, next) => {

  passport.authenticate("local", {
    successRedirect: '/projetos/listaProjetos',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);

});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', "Deslogado com sucesso!")
  res.redirect("/");
})

router.get('/emConstrucao', (req, res) => {
  res.render('emConstrucao', {
    style: 'styles.css'
  });
})

module.exports = router;