// Rota utilizada para telas básicas do sistema

const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database.js");
const passport = require("passport");
const { autenticado } = require("../helpers/validaAutenticacao.js");


//* Tela de login do sistema

router.get('/', (req, res) => {

  res.render('login', {
    style: 'styles.css'
  });

});

router.get('/login/:email/:senha', (req, res) => {

  res.render('login', {
    style: 'styles.css',
    email: req.params.email,
    senha: req.params.senha
  });

});

//* Rota para envio do formulário da tela de login

router.post('/', (req, res, next) => {

  /* Middleware valida se credenciais estão corretas
  *  Se credenciais corretas: mostra a tela de listagem de projetos
  *  Se não: volta para a tela de login pedindo para verificar as credencias
  */
  passport.authenticate("local", {
    successRedirect: '/projetos/listaProjetos',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);

});


// Logout do sistema

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', "Deslogado com sucesso!")
  res.redirect("/");
})


// Tela de preenchimento para botões com rotas ainda não implementadas

router.get('/emConstrucao', (req, res) => {
  res.render('emConstrucao', {
    style: 'styles.css'
  });
})

module.exports = router;