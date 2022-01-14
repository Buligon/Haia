function editaStatus(idStatus, idProjeto) {
  nome = document.getElementById("status"+idStatus).innerHTML
  document.getElementById("nomeStatus").setAttribute('value', nome.trim());
  document.getElementById("formEdicaoStatus").setAttribute('action', "/projetos/projetoTarefas/" + idProjeto + "/editaStatus/" + idStatus);
}

function editaSprint(idSprint, idProjeto) {
  console.log("teste")
  nome = document.getElementById("sprint"+idSprint).innerHTML
  document.getElementById("nomeSprint").setAttribute('value', nome.trim());
  document.getElementById("formEdicaoSprint").setAttribute('action', "/projetos/projetoTarefas/" + idProjeto + "/editaSprint/" + idSprint);
}