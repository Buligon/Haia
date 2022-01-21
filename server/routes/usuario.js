// Rota utilizada para telas relacionadas diretamente ao usuário e suas informações

const express = require("express");
const router = express.Router();
const { autenticado } = require("../helpers/validaAutenticacao.js");
const Usuario = require('../models/Usuario.js');
const { sequelize } = require("../config/database.js");
const bcrypt = require('bcryptjs');
const transporter = require("../config/email.js");
const { where } = require("sequelize/dist");


//* Tela de cadastro de usuários

router.get('/cadUsuario', (req, res) => {

  res.render('cadastros/cadUsuario', {
    style: 'styles.css'
  });

});


//* Rota para envio do formulário de cadastro de usuários

router.post('/cadUsuario', (req, res) => {
  var erros = [];


  /* ------ INÍCIO VALIDAÇÕES SEM CONSULTAS AO BANCO DE DADOS ------*/

  // Valida se nome foi preenchido corretamente
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome inválido!" });
  }

  // Valida se email foi preenchido corretamente
  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({ texto: "Email inválido!" });
  }

  // Valida se as senhas foram preenchidas corretamente
  if (!req.body.pwd || typeof req.body.pwd == undefined || req.body.pwd == null || !req.body.pwd2 || typeof req.body.pwd2 == undefined || req.body.pwd2 == null) {
    erros.push({ texto: "Senha inválida!" });
  }

  if (req.body.pwd != req.body.pwd2) {
    erros.push({ texto: "Senhas não coincidem!" });
  }

  if (req.body.pwd2.length < 5) {
    erros.push({ texto: "Senha muito curta!" });
  }


  /* ------ FINAL VALIDAÇÕES SEM CONSULTAS AO BANCO DE DADOS ------*/


  // Valida se os dados não passaram em alguma validação
  if (erros.length > 0) {

    res.render("cadastros/cadUsuario", {
      style: 'styles.css',
      erros: erros
    });

  } else {

    // Valida se já existe um usuário cadastrado com o email do formulário
    Usuario.findAll({ where: { email: req.body.email } }).then((usuario) => {
      if (!(JSON.stringify(usuario) == `[]`)) {

        req.flash("error_msg", "já existe uma conta com esse email!")
        res.redirect("cadUsuario")

      } else {

        // Caso os os dados enviados atendam os requisitos, recebe os dados do formulário
        const novoUsuario = new Usuario({
          nomeUsuario: req.body.nome,
          dataNascimento: req.body.datanasc,
          email: req.body.email,
          senha: req.body.pwd
        });

        bcrypt.genSalt(10, (erro, salt) => {

          // Hasheia a senha recebida
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
            if (erro) {
              req.flash("error_msg", "Houve um erro ao salvar usuário!");
              res.redirect("/");
            } else {

              novoUsuario.senha = hash;

              // Caso não haja nenhum erro durante todo o processo, salva o usuário no banco de dados
              Usuario.create({

                nomeUsuario: novoUsuario.nomeUsuario,
                dataNascimento: novoUsuario.dataNascimento,
                email: novoUsuario.email,
                senha: novoUsuario.senha

              }).then(function (result) {

                req.flash("succes_msg", "Conta criada com sucesso!");

                transporter.sendMail({
                  from: "Haia <haia.software.noreply@gmail.com>",
                  to: result.email,
                  subject: "Conta criada com sucesso",
                  text: "Olá, " + result.nomeUsuario + "! Ficamos muito feliz que esteja utilizando nossa plataforma! Sua conta foi criada com sucesso.",
                  /*  html: */
                }).then(message => {
                  console.log(message);
                }).catch(err => {
                  console.log(err);
                });

                res.redirect('/projetos/listaProjetos')

              }).catch(function (erro) {

                req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!" + erro);
                res.redirect('cadUsuario');

              });

            }
          })

        })

      }
    }).catch((err) => {

      req.flash("error_msg", "Houve um erro interno");
      res.redirect("cadUsuario")

    })

  }

});


//* Rota para perfil do usuário

router.get('/perfil', autenticado, async (req, res) => {
  var dadosUsuario;

  await Usuario.findAll({
    where: {
      idUsuarios: req.user.idUsuarios
    }
  }).then(result => {
    dadosUsuario = result;
  }).catch(err => {
    req.flash("error_msg", "Houve um erro ao listar os dados do usuário!");
    res.redirect("/projetos/listaProjetos");
  });

  res.render('perfil', {
    style: 'styles.css',
    layout: 'perfilLayout.hbs',
    Usuario: dadosUsuario.map(dadosUsuario => dadosUsuario.toJSON())
  });

})

//* Rota para edição de usuários

router.post('/perfil/alteradados', autenticado, async (req, res) => {
  var erros = [];


  /* ---- -------------- INÍCIO VALIDAÇÕES -------------- ----*/

  // Valida se o email foi preenchido corretamente
  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({ texto: "Preencha o email!" });
  }

  // Valida se o nome foi preenchido corretamente
  if (!req.body.nomeUsuario || typeof req.body.nomeUsuario == undefined || req.body.nomeUsuario == null) {
    erros.push({ texto: "Preencha o nome!" });
  }

  // Valida se a data de nascimento foi preenchido corretamente
  if (!req.body.dataNascimento || typeof req.body.dataNascimento == undefined || req.body.dataNascimento == null) {
    erros.push({ texto: "Preencha a data de nascimento!" });
  }

  // Valida se a senha atual foi preenchida corretamente
  if (!req.body.senhaAntiga || typeof req.body.senhaAntiga == undefined || req.body.senhaAntiga == null) {
    erros.push({ texto: "Preencha a senha atual!" });
  }

  // Valida se a senha antiga informada pelo usuário bate com a salva no BD
  Usuario.findOne({ where: { idUsuarios: req.user.idUsuarios } }).then((usuario) => {
    // Compara se a senha informada bate com o hash presente no banco de dados
    bcrypt.compare(req.body.senhaAntiga, usuario.senha, (erro, batem) => {

      if (!batem) {
        erros.push({ texto: "Senha informada é inválida" });
      }

    })
  });

  // Valida se não foi realizada alteração de senha
  if (!req.body.senhaNova || typeof req.body.senhaNova == undefined || req.body.senhaNova == null && !req.body.confirmacaoSenha || typeof req.body.confirmacaoSenha == undefined || req.body.confirmacaoSenha == null) {

    // Valida se os dados não passaram em alguma validação
    if (erros.length > 0) {

      var dadosUsuario;

      await Usuario.findAll({
        where: {
          idUsuarios: req.user.idUsuarios
        }
      }).then(result => {
        dadosUsuario = result;
      }).catch(err => {
        req.flash("error_msg", "Houve um erro ao listar os dados do usuário!");
        res.redirect("/projetos/listaProjetos");
      });

      res.render('perfil', {
        style: 'styles.css',
        layout: 'perfilLayout.hbs',
        Usuario: dadosUsuario.map(dadosUsuario => dadosUsuario.toJSON()),
        erros: erros
      });

    } else {

      await Usuario.update(
        {
          nomeUsuario: req.body.nomeUsuario,
          dataNascimento: req.body.dataNascimento,
          email: req.body.email,
        },
        {
          where: { idUsuarios: req.user.idUsuarios }
        }
      ).then(result => {
        req.flash("success_msg", "Dados atualizados com sucesso!");
        res.redirect("/usuarios/perfil");
      }).catch(err => {
        req.flash("error_msg", "Houve um erro ao atualizar dados do usuário!");
        res.redirect("/usuarios/perfil");
      });

    }

  } else {
    // Valida se a nova senha foi preenchida corretamente
    if (!req.body.senhaNova || typeof req.body.senhaNova == undefined || req.body.senhaNova == null) {
      erros.push({ texto: "Preencha a nova senha!" });
    }

    // Valida se a confirmação de senha foi preenchida corretamente
    if (!req.body.confirmacaoSenha || typeof req.body.confirmacaoSenha == undefined || req.body.confirmacaoSenha == null) {
      erros.push({ texto: "Preencha a confirmação de senha!" });
    }

    // Valida se as senhas informadas coincidem
    if (req.body.senhaNova != req.body.confirmacaoSenha) {
      erros.push({ texto: "Senhas não coincidem!" });
    }

    // Valida o tamanho da nova senha
    if (req.body.senhaNova.length < 5) {
      erros.push({ texto: "Senha muito curta!" });
    }

    // Valida se os dados não passaram em alguma validação
    if (erros.length > 0) {

      var dadosUsuario;

      await Usuario.findAll({
        where: {
          idUsuarios: req.user.idUsuarios
        }
      }).then(result => {
        dadosUsuario = result;
      }).catch(err => {
        req.flash("error_msg", "Houve um erro ao listar os dados do usuário!");
        res.redirect("/projetos/listaProjetos");
      });

      res.render('perfil', {
        style: 'styles.css',
        layout: 'perfilLayout.hbs',
        Usuario: dadosUsuario.map(dadosUsuario => dadosUsuario.toJSON()),
        erros: erros
      });

    } else {

      // Caso os os dados enviados atendam os requisitos, recebe os dados do formulário
      var alteraUsuario = {
        nomeUsuario: req.body.nomeUsuario,
        dataNascimento: req.body.dataNascimento,
        email: req.body.email,
        senha: req.body.senhaNova
      };

      bcrypt.genSalt(10, (erro, salt) => {

        // Hasheia a senha recebida
        bcrypt.hash(alteraUsuario.senha, salt, async (erro, hash) => {
          if (erro) {
            console.log(erro)
            req.flash("error_msg", "Houve um erro ao alterar dados do usuário!");
            res.redirect("/usuarios/perfil");
          } else {  
            await Usuario.update(
              {
                nomeUsuario: alteraUsuario.nomeUsuario,
                dataNascimento: alteraUsuario.dataNascimento,
                email: alteraUsuario.email,
                senha: hash
              },
              {
                where: { idUsuarios: req.user.idUsuarios }
              }
            ).then(result => {
              req.flash("success_msg", "Dados atualizados com sucesso!");
              res.redirect("/usuarios/perfil");
            }).catch(err => {
              req.flash("error_msg", "Houve um erro ao atualizar dados do usuário!");
              res.redirect("/usuarios/perfil");
            });
          }
        })
      })

    }
  }

  /* ---- -------------- FINAL VALIDAÇÕES -------------- ----*/

});

module.exports = router;