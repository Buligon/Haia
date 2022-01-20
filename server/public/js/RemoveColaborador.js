function removeUsuario(idProjetoColaborador, idProjeto) {
  var url = "/projetoConfig/removeColaborador/" + idProjeto + "/" + idProjetoColaborador;

  var form = $('<form action="' + url + '" method="post">' +
    '</form>');
  $('body').append(form);
  form.submit();
}