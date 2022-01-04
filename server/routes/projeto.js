const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database.js");
const passport = require("passport");
const { autenticado } = require("../helpers/validaAutenticacao.js");

const Projeto = require('../models/Projeto.js');
const ProjetoColaboradores = require('../models/ProjetoColaboradores');
const Tarefa = require('../models/Tarefa.js');
const TarefasRespostas = require('../models/TarefasRespostas');
const Usuario = require('../models/Usuario');

router.get('/listaProjetos', autenticado, async (req, res) => {

  await Projeto.findAll({
    include: [{
      model: ProjetoColaboradores,
      where: { 'idUsuario': req.user.idUsuarios }
    }],
    where: { cancelado: null }
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
      Tarefa: Tarefa.map(Tarefa => Tarefa.toJSON()),
      idProjeto: req.params.codProjeto
    });
    console.log(Tarefa => Tarefa.toJSON())
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/listaProjetos")
  });
});

router.get('/tarefa/:codTarefa', autenticado, async (req, res) => {
  var tarefaRespostas;

  await TarefasRespostas.findAll({
    include: [
      {
        model: ProjetoColaboradores,
        include: [{
          model: Usuario,
          attributes: []
        }],
        attributes: []
      },
    ],
    where: {
      idTarefa: req.params.codTarefa
    },
    attributes: [
      'resposta',
      'dataResposta',
      [sequelize.col('ProjetoColaboradores.Usuarios.nomeUsuario'), 'nomeUsuario'],
      'statusAnterior',
      'statusNovo'
    ]
  }).then(TarefasRespostas => {
    tarefaRespostas = TarefasRespostas;
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao carregar a tarefa!" + JSON.stringify(err));
    res.redirect("/")
  });
  console.log(tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON()))
  // todo: otimizar busca, não utilizando findall
  await Tarefa.findAll({
    where: {
      idTarefas: req.params.codTarefa
    }
  }).then((Tarefa) => {
    res.render('tarefas', {
      layout: 'tarefasLayout.hbs',
      style: 'styles.css',
      Tarefa: Tarefa.map(Tarefa => Tarefa.toJSON()),
      TarefaRespostas: tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON())
    });
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao carregar a tarefa!" + JSON.stringify(err));
    res.redirect("/")
  })

});

module.exports = router;