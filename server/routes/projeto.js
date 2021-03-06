// Rota utilizada para telas diretamente relacionadas a projetos/tarefas

const express = require("express");
const router = express.Router();
const { sequelize, Sequelize } = require("../config/database.js");
const { autenticado } = require("../helpers/validaAutenticacao.js");

// Importa models utilizados durante o escopo do código
const Projeto = require('../models/Projeto.js');
const ProjetoColaboradores = require('../models/ProjetoColaboradores');
const Tarefa = require('../models/Tarefa.js');
const TarefasRespostas = require('../models/TarefasRespostas');
const Usuario = require('../models/Usuario');
const Tags = require('../models/Tags');
const Status = require('../models/Status');
const Sprints = require('../models/Sprints');
const TarefasTags = require("../models/TarefasTags.js");
const TarefasTempo = require("../models/TarefasTempo.js");


/* --- ------------------------- INICIO LISTAPROJETOS ------------------------- --- */

//* Lista todos os projetos

router.get('/listaProjetos', autenticado, async (req, res) => {

  /*
  ? Seleciona todos os projetos do qual o usuário faz parte
  */
  //todo: adicionar validação para caso o usuário não faça mais parte do projeto
  await Projeto.findAll({
    include: [{
      model: ProjetoColaboradores,
      where: { 'idUsuario': req.user.idUsuarios, 'cancelado': null }
    }],
    where: { cancelado: null }
  }).then((projeto) => {

    res.render('listaProjetos', {
      layout: 'listaProjetosLayout.hbs',
      style: 'styles.css',
      projetos: projeto.map(projeto => projeto.toJSON()),
    });


  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar os projetos!" + JSON.stringify(err));
    res.redirect("/")
  });
});


//* Cria um novo projeto

router.post('/listaProjetos', autenticado, async (req, res) => {

  // Verifica se o campo nome foi preenchido. Caso não, redireciona o usuário para a rota pedindo para informar o campo
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    req.flash("error_msg", "Preencha o campo nome!");
    res.redirect("/listaProjetos");
  } else {
    Projeto.create({
      nomeProjeto: req.body.nome,
      codigoCriador: req.user.idUsuarios,
      descricao: req.body.descricao/* ,
      banner: req.body.banner */
    }).then(function (result) {
      ProjetoColaboradores.create({
        idUsuario: req.user.idUsuarios,
        idProjeto: result.idProjetos,
        idCargo: 1,
        dataCriacao: Sequelize.fn('now')
      });

      req.flash("succes_msg", "Projeto criado com sucesso!");
      res.redirect("/projetos/projetoTarefas/" + result.idProjetos);

    }).catch(function (erro) {

      req.flash("error_msg", "Houve um erro ao criar o projeto!" + JSON.stringify(erro));
      res.redirect("/listaProjetos");

    });
  }
});

/* --- ------------------------- FINAL LISTAPROJETOS ------------------------- --- */


/* --- ------------------------- INICIO LISTATAREFAS ------------------------- --- */

//* Redireciona para a lista tarefas

router.get('/redireciona/:codProjeto/', autenticado, async (req, res) => {
  res.render('redireciona', {
    layout: 'projetoTarefasLayout.hbs',
    idProjeto: req.params.codProjeto,
  });
})

//* Lista todas as tarefas de um projeto

router.post('/projetoTarefas/:codProjeto/', autenticado, async (req, res) => {

  var tagsProjeto, statusProjeto, sprintProjeto;

  // Salva os filtros utilizados para que eles sejam mantidos na tela
  const filtros = { filtro_status: req.body.status, filtro_sprints: req.body.sprints, filtro_pesquisa: req.body.pesquisa, filtro_pesquisaOP: req.body.pesquisaOpcao, filtro_tagsSelecionadas: req.body.tagsSelecionadas, filtro_dataInicial: req.body.dataInicial, filtro_dataFinal: req.body.dataFinal }

  //? Seleciona todas as tags não canceladas do projeto
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

  //? Seleciona todas as sprints não canceladas do projeto
  await Sprints.findAll({
    where: {
      idProjeto: req.params.codProjeto,
      cancelada: null
    }
  }).then((sprints) => {
    sprintProjeto = sprints;
  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/");

  });

  //? Seleciona todos os status não cancelados do projeto
  await Status.findAll({
    where: {
      idProjeto: req.params.codProjeto,
      cancelado: null
    }
  }).then((status) => {
    statusProjeto = status;
  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/");

  });

  // Recebe os filtros que serão usados para buscar as tarefas
  var where = [], tarefas;

  // Sempre valida as tarefas pelo projeto e que não estejam canceladas
  where.push(
    ['t.idProjeto = ' + req.params.codProjeto],
    ['t.cancelada is null']
  );

  // Se status preenchido, adiciona ao where
  if (req.body.status != 0 && req.body.status != undefined) {
    where.push(['t.idStatus = ' + req.body.status]);
  }

  // Se sprint selecionada, adiciona ao where
  if (req.body.sprints != 0 && req.body.sprints != undefined) {
    where.push(['t.idSprint = ' + req.body.sprints]);
  }

  // Se campo pesquisa contém alguma informação, valida qual opção foi escolhida
  if (!(!req.body.pesquisa || typeof req.body.pesquisa == undefined || req.body.pesquisa == null)) {
    console.log(typeof req.body.pesquisaOpcao)

    switch (req.body.pesquisaOpcao) {
      case '1':
        where.push(["t.idTarefas LIKE '%" + req.body.pesquisa + "%'"]);
        break;
      case '2':
        where.push(["t.assunto LIKE '%" + req.body.pesquisa + "%'"]);
        break;
      case '3':
        where.push(["u.nomeUsuario LIKE '%" + req.body.pesquisa + "%'"]);
        break;
    }
  }

  // Adiciona um subselect caso o usuário selecione uma ou mais tags
  if (!(!req.body.tagsSelecionadas || typeof req.body.tagsSelecionadas == undefined || req.body.tagsSelecionadas == null)) {
    where.push(['t.idTarefas in (SELECT idTarefa FROM tarefastags tt JOIN tags ON tt.idTag = tags.idTags WHERE tags.cancelada is null AND tags.idProjeto = ' + req.params.codProjeto + ' AND tags.idTags IN (' + req.body.tagsSelecionadas + '))'])
  }

  // Função adicionada para formatar data no padrão 'YYYY-MM-DD'
  function formataData(data, tipo) {
    umDia = new Date(86400000);

    /* 
    tipo: 
    1 = data inicial
    0 = data final
    */

    if (tipo == 1) {
      return JSON.stringify(new Date(data - umDia)).slice(1, 11);
    } else {
      date = new Date(data)
      return JSON.stringify(new Date(date.getTime() + 86400000)).slice(1, 11);
    }
  }

  // Valida se data inicial foi preenchida
  if (!(!req.body.dataInicial || typeof req.body.dataInicial == undefined || req.body.dataInicial == null)) {

    dataInicial = new Date(req.body.dataInicial)


    if (!(!req.body.dataFinal || typeof req.body.dataFinal == undefined || req.body.dataFinal == null)) {
      // ambos preenchidos

      dataFinal = new Date(req.body.dataFinal)
      where.push(["t.dataCriacao between '" + formataData(dataInicial, 1) + "' and '" + formataData(dataFinal, 0) + "'"])

    } else {

      // apenas data inicial
      where.push(["t.dataCriacao > '" + formataData(dataInicial, 1) + "'"])

    }
  } else if (!(!req.body.dataFinal || typeof req.body.dataFinal == undefined || req.body.dataFinal == null)) {

    // apenas data final
    dataFinal = new Date(req.body.dataFinal)
    where.push(["t.dataCriacao < '" + formataData(dataFinal, 0) + "'"])

  }


  // Monta o where, substituindo ',' por AND e removendo o resto
  const whereOp = "where " + JSON.stringify(where).replace(/"/g, '').replace(/]/g, '').replace(/\[/g, '').replace(/,/g, ' AND ');

  //? Seleciona todas as tarefas do projeto com base nos filtros selecionados
  await sequelize.query(
    "SELECT u.nomeUsuario, t.* from tarefas t inner join projetocolaboradores pc ON t.idAutor = pc.idProjetoColaborador INNER JOIN usuarios u ON u.idUsuarios = pc.idUsuario " + whereOp,
    {
      logging: console.log,
      model: Tarefa
    }

  ).then(tarefa => {
    tarefas = tarefa
  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/")

  });

  var coresTarefas = [];

  for (var i = 0; i < tarefas.length; i++) {

    // Busca a cor da tag associada a tarefa que tenha a prioridade mais alta
    await sequelize.query('SELECT tags.cor FROM tags INNER JOIN tarefastags tt ON tags.idTags = tt.idTag WHERE tt.idProjeto = ' + req.params.codProjeto + ' AND tt.idTarefa = ' + tarefas[i].idTarefas + ' ORDER BY tags.prioridade DESC LIMIT 1;').then(result => {
      // Converte a cor retornada para string e salva no vetor
      coresTarefas[i] = [[tarefas[i].idTarefas, JSON.stringify(result[0]).slice(9, 16)]]
    })

  }

  res.render('projetoTarefas', {
    layout: 'projetoTarefasLayout.hbs',
    style: 'styles.css',
    Tarefa: tarefas.map(Tarefa => Tarefa.toJSON()),
    idProjeto: req.params.codProjeto,
    Tags: tagsProjeto.map(tagsProjeto => tagsProjeto.toJSON()),
    Status: statusProjeto.map(statusProjeto => statusProjeto.toJSON()),
    Sprints: sprintProjeto.map(sprintProjeto => sprintProjeto.toJSON()),
    Filtros: filtros,
    coresTarefas: coresTarefas
  });

  /* Caso seja necessário depurar erros no objeto retornado da query acima utilizar:
  *  console.log(Tarefa => Tarefa.toJSON())
  */

});


router.get('/projetoTarefas/:codProjeto/', autenticado, async (req, res) => {

  var tagsProjeto, statusProjeto, sprintProjeto;

  //? Seleciona todas as tags não canceladas do projeto
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

  //? Seleciona todas as sprints não canceladas do projeto
  await Sprints.findAll({
    where: {
      idProjeto: req.params.codProjeto,
      cancelada: null
    }
  }).then((sprints) => {
    sprintProjeto = sprints;
  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/");

  });

  //? Seleciona todos os status não cancelados do projeto
  await Status.findAll({
    where: {
      idProjeto: req.params.codProjeto,
      cancelado: null
    }
  }).then((status) => {
    statusProjeto = status;
  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/");

  });

  // Recebe os filtros que serão usados para buscar as tarefas
  var tarefas;

  // Função adicionada para formatar data no padrão 'YYYY-MM-DD'
  function formataData(data, tipo) {
    umDia = new Date(86400000);

    /* 
    tipo: 
    1 = data inicial
    0 = data final
    */

    if (tipo == 1) {
      return JSON.stringify(new Date(data - umDia)).slice(1, 11);
    } else {
      date = new Date(data)
      return JSON.stringify(new Date(date.getTime() + 86400000)).slice(1, 11);
    }
  }

  //? Seleciona todas as tarefas do projeto com base nos filtros selecionados
  await sequelize.query(
    "SELECT u.nomeUsuario, t.* from tarefas t inner join projetocolaboradores pc ON t.idAutor = pc.idProjetoColaborador INNER JOIN usuarios u ON u.idUsuarios = pc.idUsuario where t.idProjeto = " + req.params.codProjeto + " AND " + 't.cancelada is null',
    {
      logging: console.log,
      model: Tarefa
    }

  ).then(tarefa => {
    tarefas = tarefa
  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/")

  });

  var coresTarefas = [];

  for (var i = 0; i < tarefas.length; i++) {

    // Busca a cor da tag associada a tarefa que tenha a prioridade mais alta
    await sequelize.query('SELECT tags.cor FROM tags INNER JOIN tarefastags tt ON tags.idTags = tt.idTag WHERE tt.idProjeto = ' + req.params.codProjeto + ' AND tt.idTarefa = ' + tarefas[i].idTarefas + ' ORDER BY tags.prioridade DESC LIMIT 1;').then(result => {
      // Converte a cor retornada para string e salva no vetor
      coresTarefas[i] = [[tarefas[i].idTarefas, JSON.stringify(result[0]).slice(9, 16)]]
    })

  }

  res.render('projetoTarefas', {
    layout: 'projetoTarefasLayout.hbs',
    style: 'styles.css',
    Tarefa: tarefas.map(Tarefa => Tarefa.toJSON()),
    idProjeto: req.params.codProjeto,
    Tags: tagsProjeto.map(tagsProjeto => tagsProjeto.toJSON()),
    Status: statusProjeto.map(statusProjeto => statusProjeto.toJSON()),
    Sprints: sprintProjeto.map(sprintProjeto => sprintProjeto.toJSON()),
    coresTarefas: coresTarefas
  });

  /* Caso seja necessário depurar erros no objeto retornado da query acima utilizar:
  *  console.log(Tarefa => Tarefa.toJSON())
  */

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
    res.redirect("/projetos/projetoTarefas/" + req.params.idProjeto);
  } else {
    var prioridadeTag = 0;

    if (req.body.tagprioridade != "") {
      prioridadeTag = req.body.tagprioridade;
    }

    Tags.create({

      descricao: req.body.descricao,
      cor: req.body.cor,
      idProjeto: req.params.idProjeto,
      prioridade: prioridadeTag

    }).then(function () {

      req.flash("succes_msg", "Tag criada com sucesso!");
      res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");

    }).catch(function (erro) {

      req.flash("error_msg", "Houve um erro ao criar tag!");
      res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");

    });;

  }
});


//* Rota para edição de tags

router.post('/projetoTarefas/:idProjeto/editaTag/:idTag', autenticado, async (req, res) => {
  if (req.body.checkApagaTag == "on") {
    Tags.update(
      { cancelada: 1 },
      {
        where: {
          idProjeto: req.params.idProjeto,
          idTags: req.params.idTag
        }
      }
    )
  }

  if (!req.body.nomeTagEdicao || typeof req.body.nomeTagEdicao == undefined || req.body.nomeTagEdicao == null) {
    req.flash("error_msg", "Preencha o nome antes de alterar a tag!");
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
  } else {
    var prioridade = 0;

    if (!(!req.body.prioridadeTagEdicao || typeof req.body.prioridadeTagEdicao == undefined || req.body.prioridadeTagEdicao == null)) {
      prioridade = req.body.prioridadeTagEdicao;
    }

    await Tags.update({
      descricao: req.body.nomeTagEdicao,
      cor: req.body.corTagEdicao,
      prioridade: prioridade
    },
      {
        where: {
          idProjeto: req.params.idProjeto,
          idTags: req.params.idTag
        }
      }).then(result => {
        req.flash("success_msg", "Status alterado com sucesso");
        res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
      }).catch(err => {
        console.log(err)
      });

  }
});


//* Rota para cadastro de status

router.post('/projetoTarefas/:idProjeto/cadastroStatus', autenticado, async (req, res) => {
  if (!req.body.nomeStatusCadastro || typeof req.body.nomeStatusCadastro == undefined || req.body.nomeStatusCadastro == null) {
    req.flash("error_msg", "Preencha o nome antes de salvar o status!");
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
  } else {
    await Status.create({
      nome: req.body.nomeStatusCadastro,
      idProjeto: req.params.idProjeto
    }).then(result => {
      req.flash("success_msg", "Status criado com sucesso");
      res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
    }).catch(err => {
      console.log(err)
    })
  }
});


//* Rota para edição de status

router.post('/projetoTarefas/:idProjeto/editaStatus/:idStatus', autenticado, async (req, res) => {
  console.log(req.body.checkApagaStatus)
  if (req.body.checkApagaStatus == "on") {
    Status.destroy({
      where: {
        idStatus: req.params.idStatus
      }
    }).then(result => {
      req.flash("success_msg", "Status excluído com sucesso");
      res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
    })
  }

  if (!req.body.nomeStatus || typeof req.body.nomeStatus == undefined || req.body.nomeStatus == null) {
    req.flash("error_msg", "Preencha o nome antes de alterar o status!");
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
  } else {
    await Status.update(
      { nome: req.body.nomeStatus },
      { where: { idStatus: req.params.idStatus } }
    ).then(result => {
      req.flash("success_msg", "Status alterado com sucesso");
      res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
    }).catch(err => {
      console.log(err)
    })
  }
});


//* Rota para cadastro de sprints

router.post('/projetoTarefas/:idProjeto/cadastroSprint', autenticado, async (req, res) => {
  if (!req.body.nomeSprintCadastro || typeof req.body.nomeSprintCadastro == undefined || req.body.nomeSprintCadastro == null) {
    req.flash("error_msg", "Preencha o nome antes de salvar a sprint!");
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
  } else {
    await Sprints.create({
      nome: req.body.nomeSprintCadastro,
      idProjeto: req.params.idProjeto,
      dataCriacao: Sequelize.fn('now')
    }).then(result => {
      req.flash("success_msg", "Sprint criada com sucesso");
      res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
    }).catch(err => {
      console.log(err)
    })
  }
});


//* Rota para edição de sprints

router.post('/projetoTarefas/:idProjeto/editaSprint/:idSprint', autenticado, async (req, res) => {
  console.log(req.body.checkApagaSprint)
  if (req.body.checkApagaSprint == "on") {
    await Sprints.update(
      {
        cancelada: 1,
        dataAlteracao: Sequelize.fn('now')
      },
      { where: { idSprints: req.params.idSprint } }
    ).then(result => {
      req.flash("success_msg", "Sprint excluída com sucesso");
      res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
    })
  }

  if (!req.body.nomeSprint || typeof req.body.nomeSprint == undefined || req.body.nomeSprint == null) {
    req.flash("error_msg", "Preencha o nome antes de alterar a sprint!");
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
  } else {
    await Sprints.update(
      {
        nome: req.body.nomeSprint,
        dataAlteracao: Sequelize.fn('now')
      },
      { where: { idSprints: req.params.idSprint } }
    ).then(result => {
      req.flash("success_msg", "Sprint alterada com sucesso");
      res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
    }).catch(err => {
      console.log(err)
    })
  }
});


//* Rota para cadastro de tarefas

router.post('/projetoTarefas/:idProjeto/cadastroTarefa', autenticado, async (req, res) => {

  // Se o usuário selecionou tags, faz a associação
  async function gravaTags(idTarefaCriada) {
    // a.k.a Gravata GS

    // Recebe a string e converte para um array
    tags = req.body.tagsSelecionadas_cadTarefa.split(",")

    // Para cada tag no array cria um novo registro
    for (let i = 0; i < tags.length; i++) {
      await TarefasTags.create({
        idTarefa: idTarefaCriada,
        idTag: tags[i],
        idProjeto: req.params.idProjeto
      });
    }

  }

  // Redireciona o usuário para a tarefa criada 
  function redireciona(idTarefaCriada) {
    req.flash("succes_msg", "Tarefa criada com sucesso!");
    res.redirect('/projetos/tarefa/' + req.params.idProjeto + "/" + idTarefaCriada);
  }

  var erros = [];

  // Verifica se o campo assunto foi preenchido
  if (!req.body.cad_assunto || typeof req.body.cad_assunto == undefined || req.body.cad_assunto == null) {
    erros.push({ texto: "Preencha o assunto!" });
  }

  // Verifica se o campo detalhamento foi preenchido
  if (!req.body.cad_Detalhamento || typeof req.body.cad_Detalhamento == undefined || req.body.cad_Detalhamento == null) {
    erros.push({ texto: "Preencha o detalhamento!" });
  }

  // Verifica se o campo status foi preenchido
  if (!req.body.cad_idstatus || typeof req.body.cad_idstatus == undefined || req.body.cad_idstatus == null) {
    erros.push({ texto: "Selecione um status!" });
  }

  // Caso hajam erros, transforma o json em uma string amigável ao usuário e retorna o mesmo para listaprojetos
  if (erros.length > 0) {
    stringerros = JSON.stringify(erros).replace(/"/g, '').replace(/]/g, '').replace(/\[/g, '').replace(/,/g, ' ').replace(/{texto:/g, '').replace(/}/g, '');
    req.flash("error_msg", stringerros);
    res.redirect("/projetos/projetoTarefas/" + req.params.idProjeto);
  } else {
    var idColaborador, idTarefaCriada;

    //? Busca o id do usuário que postou a resposta
    await ProjetoColaboradores.findAll({
      where: {
        idUsuario: req.user.idUsuarios,
        cancelado: null,
        idProjeto: req.params.idProjeto
      },
      attributes: [
        'idProjetoColaborador'
      ],
      plain: true
    }).then(colaboradorId => {
      idColaborador = colaboradorId;
    }).catch((err) => {
      console.log(JSON.stringify(err))
      req.flash("error_msg", "Houve um erro ao postar resposta!");
      res.redirect("/projetos/projetoTarefas/" + req.params.idProjeto);
    });

    // Valida se foi escolhida sprint para então montar o insert
    if (req.body.cad_sprint == "sem sprint") {
      await Tarefa.create({

        assunto: req.body.cad_assunto,
        dataCraicao: Sequelize.fn('now'),
        prioridade: req.body.cad_Prioridade,
        idAutor: idColaborador.idProjetoColaborador,
        ultimaResposta: Sequelize.fn('now'),
        idProjeto: req.params.idProjeto,
        idStatus: req.body.cad_idstatus

      }).then(result => {
        console.log(result.idTarefas)
        idTarefaCriada = result.idTarefas

      }).catch(function (err) {
        req.flash("error_msg", "Houve um erro ao criar tarefa!" + JSON.stringify(err));
        res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
      });

      await TarefasRespostas.create({

        idTarefa: idTarefaCriada,
        idColaborador: idColaborador.idProjetoColaborador,
        statusAnterior: req.body.cad_idstatus,
        statusNovo: req.body.cad_idstatus,
        resposta: req.body.cad_Detalhamento,
        dataResposta: Sequelize.fn('now')

      }).then(function () {

        if (req.body.tagsSelecionadas_cadTarefa != "") { gravaTags(idTarefaCriada) }
        redireciona(idTarefaCriada);

      }).catch(function (erro) {
        req.flash("error_msg", "Ocorreu um erro ao criar tarefa!" + JSON.stringify(erro));
        res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
      });





    } else {

      await Tarefa.create({

        assunto: req.body.cad_assunto,
        dataCraicao: Sequelize.fn('now'),
        prioridade: req.body.cad_Prioridade,
        idAutor: idColaborador.idProjetoColaborador,
        ultimaResposta: Sequelize.fn('now'),
        idProjeto: req.params.idProjeto,
        idStatus: req.body.cad_idstatus,
        idSprint: req.body.cad_sprint

      }).then(function (result) {
        idTarefaCriada = result.idTarefas
      }).catch(function (err) {
        req.flash("error_msg", "Houve um erro ao criar tarefa!" + JSON.stringify(err));
        res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
      });

      await TarefasRespostas.create({

        idTarefa: idTarefaCriada,
        idColaborador: idColaborador.idProjetoColaborador,
        statusAnterior: req.body.cad_idstatus,
        statusNovo: req.body.cad_idstatus,
        resposta: req.body.cad_Detalhamento,
        dataResposta: Sequelize.fn('now')

      }).then(function () {

        if (req.body.tagsSelecionadas_cadTarefa != "") { gravaTags(idTarefaCriada) }

        redireciona(idTarefaCriada);
      }).catch(function (erro) {
        req.flash("error_msg", "Houve um erro ao criar tarefa!" + JSON.stringify(erro));
        res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
      });

    }

  }
});

/* --- -------------------------- FINAL LISTATAREFAS -------------------------- --- */


/* --- ---------------------------- INICIO TAREFA ---------------------------- --- */

//* Visualiza uma tarefa em específico

router.get('/tarefa/:idProjeto/:codTarefa', autenticado, async (req, res) => {
  var tarefaRespostas, sprintsProjeto;
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
      'statusNovo',
      [sequelize.col('ProjetoColaboradores.idProjeto'), 'idProjeto']
    ]
  }).then(TarefasRespostas => {

    // Joga o resultado na variável que será informada ao rendenizar o tarefas.hbs
    tarefaRespostas = TarefasRespostas;

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao carregar a tarefa!" + JSON.stringify(err));
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");

  });

  /* Caso seja necessário depurar erros no objeto retornado da query acima utilizar:
  *  console.log(tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON())) 
  */

  //? Busca todas as sprints não canceladas do projeto
  await Sprints.findAll({
    where: {
      idProjeto: req.params.idProjeto,
      cancelada: null
    }
  }).then((sprints) => {
    sprintsProjeto = sprints;
  }).catch((err) => {

    req.flash("error_msg", "Houve ao carregar tarefa!" + JSON.stringify(err));
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");

  });

  var tarefaVisualizada, statusProjeto, tagsTarefa, tagsProjeto, contagemtempo;

  // todo: otimizar busca, não utilizando findall
  //? Busca informações do cabeçalho da tarefa 
  await Tarefa.findAll({
    include: [{
      model: ProjetoColaboradores,
      where: {
        idprojeto: req.params.idProjeto,
      },
      include: [{
        model: Usuario,
        attributes: []
      }],
      attributes: []
    },
    {
      model: Status,
      where: {
        idprojeto: req.params.idProjeto,
      },
      attributes: []
    },
    {
      model: Sprints,
      where: {
        idprojeto: req.params.idProjeto,
      },
      attributes: [],
      required: false
    }],
    where: {
      idTarefas: req.params.codTarefa
    },
    attributes: [
      [sequelize.col('idTarefas'), 'idTarefas'],
      [sequelize.col('assunto'), 'assunto'],
      [sequelize.col('Tarefas.dataCriacao'), 'dataCriacao'],
      [sequelize.col('prioridade'), 'prioridade'],
      [sequelize.col('idAutor'), 'idAutor'],
      [sequelize.col('Tarefas.idStatus'), 'idStatus'],
      [sequelize.col('Tarefas.idSprint'), 'idSprint'],
      [sequelize.col('ProjetoColaboradore.Usuarios.nomeUsuario'), 'nomeUsuario'],
      [sequelize.col('Status.nome'), 'nomeStatus'],
      [sequelize.col('Sprint.nome'), 'nomeSprint']
    ]
  }).then(result => {
    tarefaVisualizada = result;
  }).catch(err => {
    console.log(err)
    req.flash("error_msg", "Houve um erro carregar tarefa!" + JSON.stringify(err));
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
  })

  await Status.findAll({
    where: {
      idProjeto: req.params.idProjeto,
      cancelado: null
    }
  }).then((status) => {
    statusProjeto = status;
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro carregar tarefa!" + JSON.stringify(err));
    res.redirect("/projetos/redireciona/" + req.params.idProjeto + "/");
  });


  await TarefasTags.findAll({
    include: [{
      model: Tags,
      where: {
        idprojeto: req.params.idProjeto,
        cancelada: null
      },
      attributes: []
    }],
    where: {
      idTarefa: req.params.codTarefa
    },
    attributes: [
      [sequelize.col('Tag.descricao'), 'descricao'],
      [sequelize.col('Tag.cor'), 'cor'],
      [sequelize.col('Tag.idTags'), 'idTags']
    ]
  }).then(result => {
    tagsTarefa = result;
  }).catch(err => {
    console.log(err)
  })

  await Tags.findAll({
    where: {
      cancelada: null,
      idprojeto: req.params.idProjeto
    }
  }).then(result => {
    tagsProjeto = result;
  }).catch(err => {
    console.log(err);
  });

  await TarefasTempo.findAll({
    where: {
      idTarefa: req.params.codTarefa
    }
  }).then(result => {
    contagemtempo = result
  }).catch(err => {
    console.log(err);
  })

  res.render('tarefas', {
    layout: 'tarefasLayout.hbs',
    style: 'styles.css',
    Tarefa: tarefaVisualizada.map(tarefaVisualizada => tarefaVisualizada.toJSON()),
    TarefaRespostas: tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON()),
    idProjeto: req.params.idProjeto,
    Status: statusProjeto.map(statusProjeto => statusProjeto.toJSON()),
    Sprint: sprintsProjeto.map(sprintsProjeto => sprintsProjeto.toJSON()),
    Tags: tagsTarefa.map(tagsTarefa => tagsTarefa.toJSON()),
    tagsProjeto: tagsProjeto.map(tagsProjeto => tagsProjeto.toJSON()),
    contagemtempo: contagemtempo.map(contagemtempo => contagemtempo.toJSON()),
  });
});


//* Rota utilizada para postar resposta na tarefa 

router.post('/tarefa/:idProjeto/:codTarefa', autenticado, async (req, res) => {

  function informaErro(textoErro) {
    req.flash("error_msg", textoErro);
    res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);
  }

  // Valida se o campo resposta foi enviado vazio
  if (!req.body.novaResposta || typeof req.body.novaResposta == undefined || req.body.novaResposta == null) {
    informaErro("Preencha o campo resposta!");
  }

  // ----- INÍCIO DA GRAVAÇÃO DA RESPOSTA NO BANCO DE DADOS -----

  var statusAnterior, idColaborador, sprintAnterior;

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
    res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);

  });

  //? Busca o id do usuário que postou a resposta
  await ProjetoColaboradores.findAll({
    where: {
      idUsuario: req.user.idUsuarios,
      cancelado: null,
      idProjeto: req.params.idProjeto
    },
    attributes: [
      'idProjetoColaborador'
    ],
    plain: true
  }).then(colaboradorId => {
    idColaborador = colaboradorId;
  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao postar resposta!" + JSON.stringify(err));
    res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);

  });

  //? Busca a atual sprint da tarefa
  await Tarefa.findAll({
    where: {
      idTarefas: req.params.codTarefa
    },
    attributes: [
      'idSprint'
    ],
    plain: true
  }).then(result => {
    sprintAnterior = result.idSprint;
  }).catch(err => {
    req.flash("error_msg", "Houve um erro ao postar resposta!" + JSON.stringify(err));
    res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);
  })

  // Se os dois campos não forem "igual" a null
  if (!(req.body.idSprint == "" && sprintAnterior == null)) {

    // Se o usuário mudou a sprint, atualiza isso na tabela
    if (sprintAnterior != req.body.idSprint) {

      // Se tirou a sprint, define igual a null
      if (req.body.idSprint == "") {
        await Tarefa.update({
          idSprint: null,
          dataAlteracao: Sequelize.fn('now')
        }, {
          where: { idTarefas: req.params.codTarefa }
        });
      } else {
        await Tarefa.update({
          idSprint: req.body.idSprint,
          dataAlteracao: Sequelize.fn('now')
        }, {
          where: { idTarefas: req.params.codTarefa }
        });
      }

    }
  }

  // Se o usuário mudou o status, atualiza isso na tabela
  if (statusAnterior.statusNovo != req.body.idStatus) {
    await Tarefa.update({
      idStatus: req.body.idStatus,
      dataAlteracao: Sequelize.fn('now')
    }, {
      where: { idTarefas: req.params.codTarefa }
    });
  }


  await Tarefa.update({
    ultimaResposta: Sequelize.fn('now')
  }, {
    where: { idTarefas: req.params.codTarefa }
  });

  // Cria o registro da resposta no banco de dados
  await TarefasRespostas.create({

    idTarefa: req.params.codTarefa,
    idColaborador: idColaborador.idProjetoColaborador,
    statusAnterior: statusAnterior.statusNovo,
    statusNovo: req.body.idStatus,
    resposta: req.body.novaResposta

  }).then(function () {

    req.flash("succes_msg", "Resposta publicada com sucesso!");
    res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);

  }).catch(function (erro) {

    req.flash("error_msg", "Houve um erro ao postar resposta!");
    res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);

  });

  // ----- FINAL DA GRAVAÇÃO DA RESPOSTA NO BANCO DE DADOS -----

});


//* Rota utilizada para gerenciar tags na tarefa

router.post('/tarefa/:idProjeto/:codTarefa/atualizaTags', autenticado, async (req, res) => {
  var tagsAnteriores = [], novasTags = req.body.tagsSelecionadas.split(",").map(Number);

  //? Busca todas as tags não canceladas do projeto
  await TarefasTags.findAll({
    include: [{
      model: Tags,
      where: {
        idprojeto: req.params.idProjeto,
        cancelada: null
      },
      attributes: []
    }],
    where: {
      idTarefa: req.params.codTarefa
    },
    attributes: [
      [sequelize.col('Tag.idTags'), 'idTags']
    ]
  }).then(result => {
    var temp = result.map(tagsProjeto => tagsProjeto.toJSON());

    for (let i = 0; i < temp.length; i++) {
      tagsAnteriores[i] = temp[i].idTags
    }

  }).catch(err => {
    console.log(err)
  })

  // Para entender mais: https://pt.stackoverflow.com/questions/311567/como-fazer-para-comparar-dois-vetores-em-java-script
  const tagsAdicionadas = novasTags.filter(valor => -1 === tagsAnteriores.indexOf(valor))
  const tagsremovidas = tagsAnteriores.filter(valor => -1 === novasTags.indexOf(valor))

  // Cria registros para todas as tags que foram adicionadas
  for (let i = 0; i < tagsAdicionadas.length; i++) {
    await TarefasTags.create({
      idTarefa: req.params.codTarefa,
      idProjeto: req.params.idProjeto,
      idTag: tagsAdicionadas[i]
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // Deleta as tags que foram removidas
  for (let i = 0; i < tagsremovidas.length; i++) {
    await TarefasTags.destroy({
      where: {
        idTarefa: req.params.codTarefa,
        idProjeto: req.params.idProjeto,
        idTag: tagsremovidas[i]
      }
    }).catch(err => {
      console.log(err)
    })
  }


  res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);

})


//* Rota para controle de tempo por tarefa

router.post('/tarefa/:idProjeto/:codTarefa/contaTempo', autenticado, async (req, res) => {
  var idProjetoColaborador, flag = 1;

  await ProjetoColaboradores.findAll({
    where: {
      idUsuario: req.user.idUsuarios,
      idProjeto: req.params.idProjeto
    },
    plain: true
  }).then(result => {
    idProjetoColaborador = result.idProjetoColaborador
  }).catch(err => {
    console.log(err)
    req.flash("error_msg", "Houve um erro ao iniciar contagem de tempo!");
    res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);
  });

  await TarefasTempo.findAll({
    where: {
      idTarefa: req.params.codTarefa,
      idColaborador: idProjetoColaborador,
      dataFinal: null
    }
  }).then(result => {
    flag = result;
  }).catch(err => {
    console.log(err)
  })

  if (flag.length == 0) {
    await TarefasTempo.create({
      idTarefa: req.params.codTarefa,
      idColaborador: idProjetoColaborador,
      idStatus: req.body.tempo_status,
      dataInicio: Sequelize.fn('now')
    }).then(result => {
      res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);
    }).catch(err => {
      console.log(err)
      req.flash("error_msg", "Houve um erro ao iniciar contagem de tempo!");
      res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);
    });
  } else {
    await TarefasTempo.update(
      { dataFinal: Sequelize.fn('now') },
      {
        where: {
          idTarefa: req.params.codTarefa,
          idColaborador: idProjetoColaborador,
          dataFinal: null
        }
      }
    ).then(result => {
      res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);
    }).catch(err => {
      console.log(err)
      req.flash("error_msg", "Houve um erro ao finalizar contagem de tempo!");
      res.redirect("/projetos/tarefa/" + req.params.idProjeto + "/" + req.params.codTarefa);
    });
  }

})

/* --- ---------------------------- FINAL TAREFA ---------------------------- --- */


module.exports = router;