function alteraCorGrid(stringTarefas) {
  var coresTarefas = stringTarefas.split(",")

  for (var i = 0; i < coresTarefas.length; i+=2) {
    document.getElementById("tarefa"+coresTarefas[i]).style.backgroundColor = coresTarefas[i+1];
    console.log("id: "+coresTarefas[i] +"cor:"+coresTarefas[i+1])
  }
}