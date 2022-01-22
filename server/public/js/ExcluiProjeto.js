function excluiProjeto(id) {
  var url = "/projetoConfig/"+ id + "/exclui" ;
  
  var form = $('<form action="' + url + '" method="post">' +
    '</form>');
  $('body').append(form);
  form.submit();
}