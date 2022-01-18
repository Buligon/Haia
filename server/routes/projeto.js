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
const ProjetoAcessos = require('../models/ProjetoAcessos');
const TarefasTags = require("../models/TarefasTags.js");


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
      where: { 'idUsuario': req.user.idUsuarios }
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
      res.redirect("/projetos/listaProjetos");

    }).catch(function (erro) {

      req.flash("error_msg", "Houve um erro ao criar o projeto!" + JSON.stringify(erro));
      res.redirect('/');

    });
  }
});

/* --- ------------------------- FINAL LISTAPROJETOS ------------------------- --- */


/* --- ------------------------- INICIO LISTATAREFAS ------------------------- --- */

//* Lista todas as tarefas de um projeto

router.post('/projetoTarefas/:codProjeto/', autenticado, async (req, res) => {

  // Controle de acesso, usado apenas para testes
  await ProjetoAcessos.findAndCountAll({
    where: {
      idUsuario: req.user.idUsuarios
    },
    plain: true
  }).then(result => {
    if (result.count > 1) {
      ProjetoAcessos.destroy({
        where: {
          idUsuario: req.user.idUsuarios
        },
        order: [['idProjetoAcessos', 'ASC']],
        limit: (result.count - 1)
      })
    }
  }).catch(err => {
    console.log(err)
  });

  // Controle de acesso, usado apenas para testes
  await ProjetoAcessos.create({
    idUsuario: req.user.idUsuarios,
    idProjeto: req.params.codProjeto
  })

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
        where.push(["t.autorRazaoSocial LIKE '%" + req.body.pesquisa + "%'"]);
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

  console.log(coresTarefas)

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
      res.redirect("/projetos/listaProjetos");

    }).catch(function (erro) {

      req.flash("error_msg", "Houve um erro ao criar tag!");
      res.redirect('/projetos/tarefa/' + req.params.idProjeto + "/" + req.params.codTarefa);

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
    res.redirect("/projetos/projetoTarefas/" + req.params.idProjeto);
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
        res.redirect("/projetos/listaProjetos/");
      }).catch(err => {
        console.log(err)
      });

  }
});


//* Rota para cadastro de status

router.post('/projetoTarefas/:idProjeto/cadastroStatus', autenticado, async (req, res) => {
  if (!req.body.nomeStatusCadastro || typeof req.body.nomeStatusCadastro == undefined || req.body.nomeStatusCadastro == null) {
    req.flash("error_msg", "Preencha o nome antes de salvar o status!");
    res.redirect("/projetos/listaProjeots");
  } else {
    await Status.create({
      nome: req.body.nomeStatusCadastro,
      idProjeto: req.params.idProjeto
    }).then(result => {
      req.flash("success_msg", "Status criado com sucesso");
      res.redirect("/projetos/listaProjetos/");
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
      res.redirect("/projetos/listaProjetos/");
    })
  }

  if (!req.body.nomeStatus || typeof req.body.nomeStatus == undefined || req.body.nomeStatus == null) {
    req.flash("error_msg", "Preencha o nome antes de alterar o status!");
    res.redirect("/projetos/projetoTarefas/" + req.params.idProjeto);
  } else {
    await Status.update(
      { nome: req.body.nomeStatus },
      { where: { idStatus: req.params.idStatus } }
    ).then(result => {
      req.flash("success_msg", "Status alterado com sucesso");
      res.redirect("/projetos/listaProjetos/");
    }).catch(err => {
      console.log(err)
    })
  }
});


//* Rota para cadastro de sprints

router.post('/projetoTarefas/:idProjeto/cadastroSprint', autenticado, async (req, res) => {
  if (!req.body.nomeSprintCadastro || typeof req.body.nomeSprintCadastro == undefined || req.body.nomeSprintCadastro == null) {
    req.flash("error_msg", "Preencha o nome antes de salvar a sprint!");
    res.redirect("/projetos/listaProjeots");
  } else {
    await Sprints.create({
      nome: req.body.nomeSprintCadastro,
      idProjeto: req.params.idProjeto,
      dataCriacao: Sequelize.fn('now')
    }).then(result => {
      req.flash("success_msg", "Sprint criada com sucesso");
      res.redirect("/projetos/listaProjetos/");
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
      res.redirect("/projetos/listaProjetos/");
    })
  }

  if (!req.body.nomeSprint || typeof req.body.nomeSprint == undefined || req.body.nomeSprint == null) {
    req.flash("error_msg", "Preencha o nome antes de alterar a sprint!");
    res.redirect("/projetos/projetoTarefas/" + req.params.idProjeto);
  } else {
    await Sprints.update(
      {
        nome: req.body.nomeSprint,
        dataAlteracao: Sequelize.fn('now')
      },
      { where: { idSprints: req.params.idSprint } }
    ).then(result => {
      req.flash("success_msg", "Sprint alterada com sucesso");
      res.redirect("/projetos/listaProjetos/");
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

  // Caso hajam erros, transforma o json em uma string amigável ao usuário e retorna o mesmo para listaprojetos
  if (erros.length > 0) {
    stringerros = JSON.stringify(erros).replace(/"/g, '').replace(/]/g, '').replace(/\[/g, '').replace(/,/g, ' ').replace(/{texto:/g, '').replace(/}/g, '');
    req.flash("error_msg", stringerros);
    res.redirect("/projetos/listaProjetos");
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

      req.flash("error_msg", "Houve um erro ao postar resposta!" + JSON.stringify(err));
      res.redirect("/");

    });

    // Valida se foi escolhida sprint para então montar o insert
    if (req.body.cad_sprint == "sem sprint") {
      Tarefa.create({

        assunto: req.body.cad_assunto,
        dataCraicao: Sequelize.fn('now'),
        prioridade: req.body.cad_Prioridade,
        idAutor: idColaborador.idProjetoColaborador,
        ultimaResposta: Sequelize.fn('now'),
        idProjeto: req.params.idProjeto,
        idStatus: req.body.cad_idstatus

      }).then(function (result) {
        idTarefaCriada = result.idTarefas

        TarefasRespostas.create({

          idTarefa: idTarefaCriada,
          idColaborador: idColaborador.idProjetoColaborador,
          statusAnterior: req.body.cad_idstatus,
          statusNovo: req.body.cad_idstatus,
          resposta: req.body.cad_Detalhamento,
          dataResposta: Sequelize.fn('now')

        })
        //* Código abaixo comentado pois não irá cair na condição, entretanto pode ser utilizado para testes
        /* .then(function () {
          req.flash("succes_msg", "Tarefa criada com sucesso!");
          res.redirect('/');
        }).catch(function (erro) {
          req.flash("error_msg", "Houveasfefa!" + JSON.stringify(erro));
          res.redirect('/');
        }); */

        if (req.body.tagsSelecionadas_cadTarefa != "") { gravaTags(idTarefaCriada) }

        redireciona(idTarefaCriada);

      }).catch(function (err) {
        req.flash("error_msg", "Houve um erro ao criar tarefa!" + JSON.stringify(err));
        res.redirect('/');
      });

    } else {

      Tarefa.create({

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

        TarefasRespostas.create({

          idTarefa: idTarefaCriada,
          idColaborador: idColaborador.idProjetoColaborador,
          statusAnterior: req.body.cad_idstatus,
          statusNovo: req.body.cad_idstatus,
          resposta: req.body.cad_Detalhamento,
          dataResposta: Sequelize.fn('now')

        })
        //* Código abaixo comentado pois não irá cair na condição, entretanto pode ser utilizado para testes
        /* .then(function () {
          req.flash("succes_msg", "Tarefa criada com sucesso!");
          res.redirect('/');
        }).catch(function (erro) {
          req.flash("error_msg", "Houveasfefa!" + JSON.stringify(erro));
          res.redirect('/');
        }); */

        if (req.body.tagsSelecionadas_cadTarefa != "") { gravaTags(idTarefaCriada) }

        redireciona(idTarefaCriada);

      }).catch(function (err) {
        req.flash("error_msg", "Houve um erro ao criar tarefa!" + JSON.stringify(err));
        res.redirect('/');
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
    res.redirect("/")

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
    res.redirect("/");

  });

  var tarefaVisualizada, statusProjeto, tagsTarefa, tagsProjeto;

  // todo: otimizar busca, não utilizando findall
  await Tarefa.findAll({

    where: {
      idTarefas: req.params.codTarefa
    }

  }).then(result => {
    tarefaVisualizada = result;
  }).catch(err => {
    req.flash("error_msg", "Houve um erro carregar tarefa!" + JSON.stringify(err));
    res.redirect("/");
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
    res.redirect("/");
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

  res.render('tarefas', {
    layout: 'tarefasLayout.hbs',
    style: 'styles.css',
    Tarefa: tarefaVisualizada.map(tarefaVisualizada => tarefaVisualizada.toJSON()),
    TarefaRespostas: tarefaRespostas.map(tarefaRespostas => tarefaRespostas.toJSON()),
    idProjeto: req.params.idProjeto,
    Status: statusProjeto.map(statusProjeto => statusProjeto.toJSON()),
    Sprint: sprintsProjeto.map(sprintsProjeto => sprintsProjeto.toJSON()),
    Tags: tagsTarefa.map(tagsTarefa => tagsTarefa.toJSON()),
    tagsProjeto: tagsProjeto.map(tagsProjeto => tagsProjeto.toJSON())
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
    res.redirect("/");

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
    res.redirect("/");

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
    res.redirect("/");
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

router.post('/tarefa/:idProjeto/:codTarefa/atualizaTags', autenticado, async (req, res) => {
  var tagsAnteriores = [], novasTags = req.body.tagsSelecionadas.split(",").map(Number);

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

  res.redirect("/projetos/tarefa/"+ req.params.idProjeto +"/" + req.params.codTarefa);

})
/* --- ---------------------------- FINAL TAREFA ---------------------------- --- */

module.exports = router;