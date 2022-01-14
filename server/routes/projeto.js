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


//* Lista todas as tarefas de um projeto

router.post('/projetoTarefas/:codProjeto/', autenticado, async (req, res) => {
  var idProjeto;

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

  await ProjetoAcessos.create({
    idUsuario: req.user.idUsuarios,
    idProjeto: req.params.codProjeto
  }).then(result => {
    console.log(result)
  }).catch(err => {
    console.log(err)
  });

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
  var where = [];

  // Sempre valida as tarefas pelo projeto e que não estejam canceladas
  where.push(
    ['idProjeto = ' + req.params.codProjeto],
    ['cancelada is null']
  );

  // Se status preenchido, adiciona ao where
  if (req.body.status != 0 && req.body.status != undefined) {
    where.push(['idStatus = ' + req.body.status]);
  }

  // Se sprint selecionada, adiciona ao where
  if (req.body.sprints != 0 && req.body.sprints != undefined) {
    where.push(['idSprint = ' + req.body.sprints]);
  }

  // Se campo pesquisa contém alguma informação, valida qual opção foi escolhida
  if (!(!req.body.pesquisa || typeof req.body.pesquisa == undefined || req.body.pesquisa == null)) {
    console.log(typeof req.body.pesquisaOpcao)

    switch (req.body.pesquisaOpcao) {
      case '1':
        where.push(["idTarefas LIKE '%" + req.body.pesquisa + "%'"]);
        break;
      case '2':
        where.push(["assunto LIKE '%" + req.body.pesquisa + "%'"]);
        break;
      case '3':
        where.push(["autorRazaoSocial LIKE '%" + req.body.pesquisa + "%'"]);
        break;
    }
  }

  // Adiciona um subselect caso o usuário selecione uma ou mais tags
  if (!(!req.body.tagsSelecionadas || typeof req.body.tagsSelecionadas == undefined || req.body.tagsSelecionadas == null)) {
    where.push(['idtarefas IN ( SELECT idTarefa FROM tarefastags tt JOIN tags ON tt.idtag = tags.idTags where tt.cancelado IS NULL AND tags.cancelada IS NULL AND tags.idProjeto = ' + req.params.codProjeto + ')'])
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
      where.push(["dataCriacao between '" + formataData(dataInicial, 1) + "' and '" + formataData(dataFinal, 0) + "'"])

    } else {

      // apenas data inicial
      where.push(["dataCriacao > '" + formataData(dataInicial, 1) + "'"])

    }
  } else if (!(!req.body.dataFinal || typeof req.body.dataFinal == undefined || req.body.dataFinal == null)) {

    // apenas data final
    dataFinal = new Date(req.body.dataFinal)
    where.push(["dataCriacao < '" + formataData(dataFinal, 0) + "'"])

  }


  // Monta o where, substituindo ',' por AND e removendo o resto
  const whereOp = "where " + JSON.stringify(where).replace(/"/g, '').replace(/]/g, '').replace(/\[/g, '').replace(/,/g, ' AND ');

  //? Seleciona todas as tarefas do projeto com base nos filtros selecionados
  await sequelize.query(

    "select * from tarefas " + whereOp,
    {
      logging: console.log,
      model: Tarefa
    }

  ).then(tarefa => {

    res.render('projetoTarefas', {
      layout: 'projetoTarefasLayout.hbs',
      style: 'styles.css',
      Tarefa: tarefa.map(Tarefa => Tarefa.toJSON()),
      idProjeto: req.params.codProjeto,
      Tags: tagsProjeto.map(tagsProjeto => tagsProjeto.toJSON()),
      Status: statusProjeto.map(statusProjeto => statusProjeto.toJSON()),
      Sprints: sprintProjeto.map(sprintProjeto => sprintProjeto.toJSON()),
      Filtros: filtros
    });

    /* Caso seja necessário depurar erros no objeto retornado da query acima utilizar:
    *  console.log(Tarefa => Tarefa.toJSON())
    */

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao listar as tarefas!" + JSON.stringify(err));
    res.redirect("/")

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
    res.redirect("/projetos/projetoTarefas/" + req.params.idProjeto);
  } else {

    Tags.create({

      descricao: req.body.descricao,
      cor: req.body.cor,
      idProjeto: req.params.idProjeto

    }).then(function () {

      req.flash("succes_msg", "Tag criada com sucesso!");
      res.redirect("/projetos/listaProjetos");

    }).catch(function (erro) {

      req.flash("error_msg", "Houve um erro ao criar tag!");
      res.redirect('/projetos/tarefa/' + req.params.codTarefa);

    });;

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
        req.flash("succes_msg", "Tarefa criada com sucesso!");
        res.redirect('/projetos/tarefa/' + idTarefaCriada);
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
        req.flash("succes_msg", "Tarefa criada com sucesso!");
        res.redirect('/projetos/tarefa/' + idTarefaCriada);
      }).catch(function (err) {
        req.flash("error_msg", "Houve um erro ao criar tarefa!" + JSON.stringify(err));
        res.redirect('/');
      });

    }

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
      idProjeto: Tarefa.idProjeto
    });

  }).catch((err) => {

    req.flash("error_msg", "Houve um erro ao carregar a tarefa!" + JSON.stringify(err));
    res.redirect("/")

  })

});


//* Rota utilizada para postar resposta na tarefa 

router.post('/tarefa/:codTarefa', autenticado, async (req, res) => {
  var idProjeto;

  await Tarefa.findAll({
    where: {
      idTarefas: req.params.codTarefa
    },
    plain: true
  }).then(result => {
    idProjeto = result.idProjeto
  }).catch(err => {
    console.log(err)
  })

  function informaErro(textoErro) {
    req.flash("error_msg", textoErro);
    res.redirect("/projetos/tarefa/" + req.params.codTarefa);
  }

  // Valida se o campo resposta foi enviado vazio
  if (!req.body.novaResposta || typeof req.body.novaResposta == undefined || req.body.novaResposta == null) {
    informaErro("Preencha o campo resposta!");
  }

  // ----- INÍCIO DA GRAVAÇÃO DA RESPOSTA NO BANCO DE DADOS -----

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
      idProjeto: idProjeto
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

  // ----- FINAL DA GRAVAÇÃO DA RESPOSTA NO BANCO DE DADOS -----

});

module.exports = router;