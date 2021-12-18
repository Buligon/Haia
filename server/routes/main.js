const express = require("express");
const router = express.Router();

const Usuario = require('../models/Usuario.js');
const { sequelize } = require("../config/database.js");
router.get('/', (req, res) => {
  res.render('login');
});

router.get('/cadUsuario', (req, res) => {
  res.render('cadastros/cadUsuario');
});

router.post('/addUsuario', (req, res) => {
  var erros = [];

  // Valida se nome foi preenchido corretamente
  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto: "Nome inválido!"});
  }

  // Valida se email foi preenchido corretamente
  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({texto: "Email inválido!"});
  }

  // Valida se as senhas foram preenchidas corretamente
  if(!req.body.pwd || typeof req.body.pwd == undefined || req.body.pwd == null || !req.body.pwd2 || typeof req.body.pwd2 == undefined || req.body.pwd2 == null) {
    erros.push({texto: "Senha inválida!"});
  }

  if(req.body.pwd.length < 5) {
    erros.push({texto: "Senha muito curta!"});
  }

  if(req.body.pwd.length < 5) {
    erros.push({texto: "Senha muito curta!"});
  }

  if(req.body.pwd != req.body.pwd2) {
    erros.push({texto: "Senhas não coincidem!"});
  }

  if (erros.length > 0) {
    res.render("cadastros/cadUsuario", {erros: erros});
  } else {

    Usuario.findAll({where:{email: req.body.email}}).then((usuario) => {
      if(!(JSON.stringify(usuario) == `[]`)){
        req.flash("error_msg", "já existe uma conta com esse email!")
        res.redirect("/cadUsuario")
      } else {
        Usuario.create({
          nomeUsuario: req.body.nome,
          dataNascimento: req.body.datanasc,
          email: req.body.email,
          senha: req.body.pwd
        }).then(function () {
          req.flash("succes_msg", "Conta criada com sucesso!");
          res.redirect('listaProjetos')
        }).catch(function (erro) {
          req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!");
          res.redirect('cadUsuario')
        });
      }
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("cadUsuario")
    }) 


  } 

});

router.get('/listaProjetos', (req, res) => {
  res.render('listaProjetos');
});

module.exports = router;