function abreProjeto(id) {
  var url = "/projetos/projetoTarefas/" + id;

  var form = $('<form action="' + url + '" method="post">' +
    '</form>');
  $('body').append(form);
  form.submit();
}