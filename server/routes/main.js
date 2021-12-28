const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database.js");
const passport = require("passport");

const Projeto = require('../models/Projeto.js');
const ProjetoColaboradores = require('../models/ProjetoColaboradores');

const { autenticado } = require("../helpers/validaAutenticacao.js");
const { is } = require("sequelize/dist/lib/operators");

router.get('/', (req, res) => {
  res.render('login', {
    style: 'styles.css'
  });
});

router.post('/', (req, res, next) => {

  passport.authenticate("local", {
    successRedirect: '/listaProjetos',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);

});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', "Deslogado com sucesso!")
  res.redirect("/");
})

router.get('/listaProjetos', autenticado, async (req, res) => {

  await Projeto.findAll({
    include: [{
      model: ProjetoColaboradores,
      where: { 'idUsuario': req.user.idUsuarios }
    }], 
    where: {cancelado: null}
  }).then((projetos) => {
    res.render('listaProjetos', {
      layout: 'listaProjetosLayout.hbs',
      style: 'styles.css',
      projetos: projetos.map(projetos => projetos.toJSON())
    });
    console.log(projetos => projetos.toJSON())
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar os projetos!" + JSON.stringify(err));
    res.redirect("/")
  })
});

module.exports = router;