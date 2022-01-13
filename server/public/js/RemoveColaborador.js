function removeUsuario(idProjetoColaborador) {
  var url = "/projetoConfig/removeColaborador/" + idProjetoColaborador;

  var form = $('<form action="' + url + '" method="post">' +
    '</form>');
  $('body').append(form);
  form.submit();
}