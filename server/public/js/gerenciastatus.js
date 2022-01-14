function editaStatus(idStatus, idProjeto) {
  nome = document.getElementById("status"+idStatus).innerHTML
  document.getElementById("nomeStatus").setAttribute('value', nome.trim());
  document.getElementById("formEdicaoStatus").setAttribute('action', "/projetos/projetoTarefas/" + idProjeto + "/editaStatus/" + idStatus);
}

