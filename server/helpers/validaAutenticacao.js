module.exports = {
  autenticado: (req, res, next) => {
    
    if(req.isAuthenticated()) {
      res.locals.user = req.user
      return next();
    }

    req.flash("error_msg", "Você deve estar logado para acessar essa página");
    res.redirect("/");

  }
}