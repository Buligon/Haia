// Rota utilizada para telas diretamente relacionadas a projetos/tarefas

const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database.js");
const { autenticado } = require("../helpers/validaAutenticacao.js");

// Importa models utilizados durante o escopo do código
const Projeto = require('../models/Projeto.js');
const ProjetoColaboradores = require('../models/ProjetoColaboradores');
const Tarefa = require('../models/Tarefa.js');
const TarefasRespostas = require('../models/TarefasRespostas');
const Usuario = require('../models/Usuario');
const Tags = require('../models/Tags');
const { json } = require("body-parser");

var global_Projeto;

//* Lista todos os projetos

router.get('/listaProjetos', autenticado, async (req, res) => {

  /*
  ? Seleciona todos os projetos do qual o usuário faz parte
  */
  //todo: adicionar validação para caso o usuário não faça mais parte do projeto
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


//* Lista todas as tarefas não canceladas de um projeto

router.get('/projetoTarefas/:codProjeto', autenticado, async (req, res) => {
  // Toda vez que o usuário entra em um projeto, a variável global recebe o código do mesmo
  global_Projeto = req.params.codProjeto;

  var tagsProjeto;

  await Tags.findAll({
    where: {
      idProjeto: req.params.codProjeto,
      cancelada: null
    }
  }).then((tags) => {
    tagsProjeto = tags;
  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/");

  });


  //? Seleciona todas as tarefas do projeto que não estejam canceladas
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
      idProjeto: req.params.codProjeto,
      Tags: tagsProjeto.map(Tarefa => Tarefa.toJSON())
    });

    /* Caso seja necessário depurar erros no objeto retornado da query acima utilizar:
    *  console.log(Tarefa => Tarefa.toJSON())
    */

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/listaProjetos")

  });

});


//* Rota para cadastro de tags

router.post('/projetoTarefas/:idProjeto/cadastroTag', autenticado, async (req, res) => {
  var erros = [];

  // Verifica se o campo descrição foi preenchido
  if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
    erros.push({ texto: "Preencha o campo descricao!" });
  }

  // Caso ele não tenha sido preenchido, redireciona o usuário para a rota pedindo para informar o campo
  if (erros.length > 0) {
    req.flash("error_msg", "Preencha o campo descrição antes de salvar a tag!");
    res.redirect("/projetos/projetoTarefas/" + global_Projeto);
  } else {

    Tags.create({

      descricao: req.body.descricao,
      cor: req.body.cor,
      idProjeto: global_Projeto

    }).then(function () {

      req.flash("succes_msg", "Tag criada com sucesso!");
      res.redirect("/projetos/projetoTarefas/" + global_Projeto);

    }).catch(function (erro) {

      req.flash("error_msg", "Houve um erro ao criar tag!");
      res.redirect('/projetos/tarefa/' + req.params.codTarefa);

    });;

  }
});


//* Visualiza uma tarefa em específico

router.get('/tarefa/:codTarefa', autenticado, async (req, res) => {
  var tarefaRespostas;
  /*
  ? Query utilizada para buscar o nome do usuário e os outros campos das respostas na tarefa
  ? O model TarefasRespostas é ligado ao model ProjetoColaboradores e Usuario por um Left Outer Join
  */
  await TarefasRespostas.findAll({


    include: [{
      model: ProjetoColaboradores,
      include: [{

        model: Usuario,
        attributes: []

      }],
      attributes: []
    }],
    where: {

      idTarefa: req.params.codTarefa

    },
    attributes: [
      'resposta',
      'dataResposta',
      // Busca o nome do usuário com base no relacionamento das tabelas e "apelida" ele de nomeUsuario
      [sequelize.col('ProjetoColaboradores.Usuarios.nomeUsuario'), 'nomeUsuario'],
      'statusAnterior',
      'statusNovo'
    ]

  }).then(TarefasRespostas => {

    // Joga o resultado na variável que será informada ao rendenizar o tarefas.hbs
    tarefaRespostas = TarefasRespostas;

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao carregar a tarefa!" + JSON.stringify(err));
    res.redirect("/")

  });

  /* Caso seja necessário depurar erros no objeto retornado da query acima utilizar:
  *  console.log(tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON())) 
  */

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
      TarefaRespostas: tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON()),
      idProjeto: global_Projeto
    });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao carregar a tarefa!" + JSON.stringify(err));
    res.redirect("/")

  })

});


//* Rota utilizada para postar resposta na tarefa 

router.post('/tarefa/:codTarefa', autenticado, async (req, res) => {
  var erros = [];

  // Valida se o campo resposta foi enviado vazio
  if (!req.body.novaResposta || typeof req.body.novaResposta == undefined || req.body.novaResposta == null) {
    erros.push({ texto: "Preencha o campo resposta!" });
  }

  // Se o campo resposta não foi preenchido envia o usuário novamente solicitando o preenchimento
  if (erros.length > 0) {


    var tarefaRespostas;

    await TarefasRespostas.findAll({
      /*
      ? Query utilizada para buscar o nome do usuário e os outros campos das respostas na tarefa
      ? O model TarefasRespostas é ligado ao model ProjetoColaboradores e Usuario por um Left Outer Join
      */

      include: [{
        model: ProjetoColaboradores,
        include: [{

          model: Usuario,
          attributes: []

        }],
        attributes: []
      }],
      where: {

        idTarefa: req.params.codTarefa

      },
      attributes: [
        'resposta',
        'dataResposta',
        // Busca o nome do usuário com base no relacionamento das tabelas e "apelida" ele de nomeUsuario
        [sequelize.col('ProjetoColaboradores.Usuarios.nomeUsuario'), 'nomeUsuario'],
        'statusAnterior',
        'statusNovo'
      ]

    }).then(TarefasRespostas => {

      // Joga o resultado na variável que será informada ao rendenizar o tarefas.hbs
      tarefaRespostas = TarefasRespostas;

    }).catch((err) => {

      req.flash("error_msg", "Houve um erro ao carregar a tarefa!" + JSON.stringify(err));
      res.redirect("/")

    });

    /* Caso seja necessário depurar erros no objeto retornado da query acima utilizar:
    *  console.log(tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON())) 
    */

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
        TarefaRespostas: tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON()),
        erros: erros
      });

    }).catch((err) => {

      req.flash("error_msg", "Houve um erro ao carregar a tarefa!" + JSON.stringify(err));
      res.redirect("/")

    })

  } else {
    var statusAnterior, idColaborador;


    //? Busca o status atual da tarefa com base na última resposta
    await TarefasRespostas.findAll({
      where: {
        idTarefa: req.params.codTarefa
      },
      attributes: [
        'statusNovo'
      ],
      order: [['idTarefasResposta', 'DESC']],
      limit: 1,
      plain: true
    }).then(ultimostatus => {
      statusAnterior = ultimostatus
    }).catch(err => {

      req.flash("error_msg", "Houve um erro ao postar resposta!" + JSON.stringify(err));
      res.redirect("/");

    });

    //? Busca o id do usuário que postou a resposta
    await ProjetoColaboradores.findAll({
      where: {
        idUsuario: req.user.idUsuarios,
        cancelado: null,
        idProjeto: global_Projeto
      },
      attributes: [
        'idProjetoColaborador'
      ],
      plain: true
    }).then(colaboradorId => {
      idColaborador = colaboradorId;
    }).catch((err) => {

      req.flash("error_msg", "Houve um erro ao postar resposta!" + JSON.stringify(err));
      res.redirect("/");

    });

    // Cria o registro da resposta no banco de dados
    TarefasRespostas.create({

      idTarefa: req.params.codTarefa,
      idColaborador: idColaborador.idProjetoColaborador,
      statusAnterior: statusAnterior.statusNovo,
      statusNovo: 2,
      resposta: req.body.novaResposta

    }).then(function () {

      req.flash("succes_msg", "Resposta publicada com sucesso!");
      res.redirect("/projetos/tarefa/" + req.params.codTarefa);

    }).catch(function (erro) {

      req.flash("error_msg", "Houve um erro ao postar resposta!");
      res.redirect('/projetos/tarefa/' + req.params.codTarefa);

    });

  }

});


router.get('/projetoConfig', autenticado, async (req, res) => {
  var colaboradores

  ProjetoColaboradores.findAll({
    include: [{
      model: Usuario,
      attributes: []
    }],
    where: {
      idProjeto: global_Projeto,
      cancelado: null
    },
    attributes: [
      'idProjetoColaborador',
      'idCargo',
      [sequelize.col('Usuarios.nomeUsuario'), 'nomeUsuario']
    ]
  }).then(projetoColaboradores => {

    res.render('paginaProjeto', {
      layout: 'paginaProjetoLayout.hbs',
      style: 'styles.css',
      idProjeto: global_Projeto,
      Colaboradores: projetoColaboradores.map(projetoColaboradores => projetoColaboradores.toJSON())
    });
  }).catch(err => {

    req.flash("error_msg", "Houve um erro carregar as informações do projeto!" + JSON.stringify(err));
    res.redirect("/projetos/listaProjetos");

  });


});

module.exports = router;