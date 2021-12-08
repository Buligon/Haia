const express = require("express");
const router = express.Router()

const Usuario = require('../models/Usuario.js');

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/cadUsuario', (req, res) => {
  res.render('cadUsuario');
});

router.post('/cadUsuarioForm', (req, res) => {
  Usuario.create({
    nome: req.body.nome,
    sobrenome: req.body.sobrenome,
    dataNascimento: req.body.datanasc,
    email: req.body.email,
    senha: req.body.pwd
  }).then(function() {
    res.redirect('/listaProjetos')
  }).catch(function(erro) {
    res.send("Houve um erro: " + erro);
  });
})

router.get('/listaProjetos', (req, res) => {
  res.render('listaProjetos');
});

module.exports = router;