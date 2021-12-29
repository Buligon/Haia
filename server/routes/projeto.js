const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database.js");
const passport = require("passport");
const { autenticado } = require("../helpers/validaAutenticacao.js");

const Projeto = require('../models/Projeto.js');
const ProjetoColaboradores = require('../models/ProjetoColaboradores');
const Tarefa = require('../models/Tarefa.js');

router.get('/listaProjetos', autenticado, async (req, res) => {

  await Projeto.findAll({
    include: [{
      model: ProjetoColaboradores,
      where: { 'idUsuario': req.user.idUsuarios }
    }], 
    where: {cancelado: null}
  }).then((projeto) => {
    res.render('listaProjetos', {
      layout: 'listaProjetosLayout.hbs',
      style: 'styles.css',
      projetos: projeto.map(projeto => projeto.toJSON())
    });
    console.log(projeto => projeto.toJSON())
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar os projetos!" + JSON.stringify(err));
    res.redirect("/")
  });
});

router.get('/projetoTarefas/:codProjeto', autenticado, async (req, res) => {
  await Tarefa.findAll({
    where: {
      idProjeto: req.params.codProjeto,
      cancelada: null
    }
  }).then((Tarefa) => {
    res.render('projetoTarefas', {
      layout: 'projetoTarefasLayout.hbs',
      style: 'styles.css',
      Tarefa: Tarefa.map(Tarefa => Tarefa.toJSON())
    });
    console.log(Tarefa => Tarefa.toJSON()) 
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/listaProjetos")
  });
});

module.exports = router;