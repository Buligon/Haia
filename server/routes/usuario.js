const express = require("express");
const router = express.Router();

const Usuario = require('../models/Usuario.js');
const { sequelize } = require("../config/database.js");
const bcrypt = require('bcryptjs');
const flash = require("connect-flash/lib/flash");

router.get('/cadUsuario', (req, res) => {
  res.render('cadastros/cadUsuario', {
    style: 'styles.css'
  });
});

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

  if (req.body.pwd.length < 5) {
    erros.push({ texto: "Senha muito curta!" });
  }

  if (req.body.pwd.length < 5) {
    erros.push({ texto: "Senha muito curta!" });
  }

  if (req.body.pwd != req.body.pwd2) {
    erros.push({ texto: "Senhas não coincidem!" });
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
            if(erro) {
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
      
              }).then(function () {
      
                req.flash("succes_msg", "Conta criada com sucesso!");
                res.redirect('/listaProjetos')
      
              }).catch(function (erro) {
      
                req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!" + erro);
                res.redirect('cadUsuario');
    
              });

            }})

        })

      }}).catch((err) => {

      req.flash("error_msg", "Houve um erro interno");
      res.redirect("cadUsuario")

    })

  }

});

module.exports = router;