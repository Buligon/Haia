
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
    res.redirect('/projetoConfig');
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
          res.redirect('/projetoConfig');
        }).catch(err => {
          console.log(err);
        });
      });

    }).catch(err => {
      console.log(err);
      req.flash("error_msg", "Houve um erro ao convidar ususário");
      res.redirect('/');
    })
  }

});


//* Rota utilizada para aceitar convites para projetos
router.get('/aceitaConvite/:idConvites', async (req, res) => {
  await Convites.findAll({
    where: {
      idConvites: req.params.idConvites
    },
    plain: true
  }).then(convite => {
    Usuario.findAll({
      where: {
        email: convite.email
      },
      plain: true
    }).then(usuario => {
      ProjetoColaboradores.create({
        idUsuario: usuario.idUsuarios,
        idProjeto: convite.idProjeto,
        idCargo: 2,
        dataCriacao: Sequelize.fn('now')
      }).then(result => {
        req.flash('success_msg', "Agora você faz parte do projeto!")
        res.redirect('/');
      }).catch(err => {
        console.log(err)
      });
    })
  })

  Convites.update({
    aceito: 1
  }, {
    where: {
      idConvites: req.params.idConvites
    }
  });
});

module.exports = router;