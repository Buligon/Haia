const express = require("express");
const router = express.Router();

const Projeto = require('../models/Projeto.js');

const { sequelize } = require("../config/database.js");
router.get('/', (req, res) => {
  res.render('login', {
    style: 'styles.css'
  });
});

router.get('/listaProjetos', async (req, res) => {
  await Projeto.findAll().then((projetos) => {
    res.render('listaProjetos', {
      layout: 'listaProjetosLayout.hbs',
      style: 'styles.css',
      projetos: projetos.map(projetos => projetos.toJSON()) 
    });
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar os projetos!" + JSON.stringify(err));
    res.redirect("/")
  })
});

module.exports = router;