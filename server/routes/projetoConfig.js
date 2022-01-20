
const express = require("express");
const router = express.Router();
const { sequelize, Sequelize } = require("../config/database.js");
const { autenticado } = require("../helpers/validaAutenticacao.js");
const transporter = require("../config/email.js");

const Projeto = require('../models/Projeto.js');
const ProjetoColaboradores = require('../models/ProjetoColaboradores');
const Usuario = require('../models/Usuario');
const Convites = require('../models/Convites');


//* Rota utilizada para gestão do projeto

router.get('/:codProjeto', autenticado, async (req, res) => {

  ProjetoColaboradores.findAll({
    include: [{
      model: Usuario,
      attributes: []
    }],
    where: {
      idProjeto: req.params.codProjeto,
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
      idProjeto: req.params.codProjeto,
      Colaboradores: projetoColaboradores.map(projetoColaboradores => projetoColaboradores.toJSON())
    });
  }).catch(err => {

    req.flash("error_msg", "Houve um erro carregar as informações do projeto!" + JSON.stringify(err));
    res.redirect("/projetos/listaProjetos");

  });


});


//* Rota utilizada para convidar usuários ao projeto

router.post('/convidaColaborador/:codProjeto', autenticado, async (req, res) => {
  // Valida se o email foi preenchido corretamente
  if (!req.body.emailColaborador || typeof req.body.emailColaborador == undefined || req.body.emailColaborador == null) {
    req.flash("error_msg", "Por favor, preencha o campo email!");
    res.redirect('/projetoConfig/' + req.params.codProjeto);
  } else {
    Convites.create({
      idProjeto: req.params.codProjeto,
      email: req.body.emailColaborador
    }).then(result => {

      Projeto.findAll({
        where: {
          cancelado: null
        },
        plain: true
      }).then((projeto) => {
        transporter.sendMail({
          from: "Haia <haia.software.noreply@gmail.com>",
          to: req.body.emailColaborador,
          subject: "Convite para projeto",
          html: "Olá, você foi convidado para o projeto " + projeto.nomeProjeto + "<br><a href='http://localhost:8012/projetoConfig/aceitaConvite/" + result.idConvites + "'>Clique aqui</a> para aceitar."
        }).then(message => {
          req.flash("success_msg", "Usuário convidado com sucesso!");
          res.redirect('/projetoConfig/' + req.params.codProjeto);
        }).catch(err => {
          console.log(err);
        });
      });

    }).catch(err => {
      console.log(err);
      req.flash("error_msg", "Houve um erro ao convidar ususário");
      res.redirect('/projetoConfig/' + req.params.codProjeto);
    })
  }

});


//* Rota utilizada para aceitar convites para projetos

router.get('/aceitaConvite/:idConvites', async (req, res) => {
  var conviteEnviado, usuarioConvidado;

  await Convites.findAll({
    where: {
      idConvites: req.params.idConvites
    },
    plain: true
  }).then(convite => {
    conviteEnviado = convite
  }).catch(err => {
    console.log(err)
  });

  await Usuario.findAll({
    where: {
      email: conviteEnviado.email
    },
    plain: true
  }).then(usuario => {
    usuarioConvidado = usuario
  }).catch(err => {
    console.log(err)
  });
  if (usuarioConvidado == null) {
    req.flash('error_msg', "Cadastre-se antes de aceitar o convite!")
    res.redirect('/');
  } else {
    await ProjetoColaboradores.create({
      idUsuario: usuarioConvidado.idUsuarios,
      idProjeto: conviteEnviado.idProjeto,
      idCargo: 2,
      dataCriacao: Sequelize.fn('now')
    }).then(result => {
    }).catch(err => {
      console.log(err)
    });

    await Convites.update({
      aceito: 1
    }, {
      where: {
        idConvites: req.params.idConvites
      }
    }).then(result => {
      req.flash('success_msg', "Agora você faz parte do projeto!")
      res.redirect('/');
    }).catch(err => {
      console.log(err)
    });
  }

});


//* Rota utilizada para remover colaboradores

router.post('/removeColaborador/:idProjeto/:idColaborador', async (req, res) => {
  //? Identifica se o usuário é criador do projeto
  await ProjetoColaboradores.findAll({
    where: {
      idUsuario: req.user.idUsuarios,
      idProjeto: req.params.idProjeto
    },
    plain: true
  }).then(result => {
    if (result.idCargo == 2) {
      req.flash("error_msg", "Você não tem permissão para isso! Contate o criador do projeto.");
      res.redirect('/projetoConfig/' + req.params.idProjeto);
    }
  }).catch(err => {
    console.log(err);
    req.flash("error_msg", "Ocorreu um erro ao tentar remover colaborador");
    res.redirect('/projetoConfig/' + req.params.idProjeto);
  });

  await ProjetoColaboradores.update({
    cancelado: 1,
    dataAlteracao: Sequelize.fn('now')
  },
  {
    where:{
      idProjetoColaborador: req.params.idColaborador,
      idProjeto: req.params.idProjeto
    }
  }).then(result => {
    req.flash("success_msg", "Colaborador removido com sucesso");
    res.redirect('/projetoConfig/' + req.params.idProjeto);
  }).catch(err => {
    console.log(err);
    req.flash("error_msg", "Ocorreu um erro ao tentar remover colaborador");
    res.redirect('/projetoConfig/' + req.params.idProjeto);
  });

});
module.exports = router;