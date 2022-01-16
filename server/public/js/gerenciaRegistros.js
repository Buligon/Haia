function editaStatus(idStatus, idProjeto) {
  nome = document.getElementById("status"+idStatus).innerHTML

  document.getElementById("nomeStatus").setAttribute('value', nome.trim());
  document.getElementById("formEdicaoStatus").setAttribute('action', "/projetos/projetoTarefas/" + idProjeto + "/editaStatus/" + idStatus);
}

function editaSprint(idSprint, idProjeto) {
  nome = document.getElementById("sprint"+idSprint).innerHTML

  document.getElementById("nomeSprint").setAttribute('value', nome.trim());
  document.getElementById("formEdicaoSprint").setAttribute('action', "/projetos/projetoTarefas/" + idProjeto + "/editaSprint/" + idSprint);
}

function editaTag(idTag, idProjeto, cor, prioridade) {
  nome = document.getElementById("tag"+idTag).innerHTML
  
  document.getElementById("nomeTagEdicao").setAttribute('value', nome.trim());
  document.getElementById("corTagEdicao").setAttribute('value', cor);
  document.getElementById("prioridadeTagEdicao").setAttribute('value', prioridade);

  document.getElementById("formEdicaoTag").setAttribute('action', "/projetos/projetoTarefas/" + idProjeto + "/editaTag/" + idTag);


}