const localStrategy = require("passport-local").Strategy;
const { sequelize } = require("../config/database.js");
const bcrypt = require('bcryptjs');

// Model de usuário
const Usuario = require('../models/Usuario.js');

module.exports = function(passport) {

  passport.use(new localStrategy({usernameField: 'email', passwordField: 'pwd'}, (email, pwd, done) => {

     Usuario.findOne({ where: {email: email} }).then((usuario) => {   

      // Informa que a conta não existe caso o sistema não encontre nenhum registro com o email
      if(!usuario) {
        return done(null, false, {message: "Esta conta não existe"});
      }

      // Compara se a senha informada bate com o hash presente no banco de dados
      bcrypt.compare(pwd, usuario.senha, (erro, batem) => {

        if(batem) {
          return done(null, usuario);
        } else {
          return done(null, false, {message: "Email e/ou senha informados são inválidos"});
        }

      })

    })

  }));


  /// Passa os dados do usuário para a sessão
  passport.serializeUser((usuario, done) => {

    done(null, usuario.idUsuarios);

  });

  passport.deserializeUser((id, done) => {
    
    Usuario.findOne({where:{idUsuarios:id}}).then((usuario) => {
        done(null, usuario);
    }).catch((err) => {
        done(err, null);
    });

  })

}