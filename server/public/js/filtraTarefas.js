var tagselecionadas = [];
var tagselecionadas_cadTarefa = [];

// Função chamada ao clicar em uma tag
function selecionatag(idtag, idModal) {

  /*
  * idModal == 0: tags utilizadas para filtrar grid
  * idModal == 1: tags utilizadas para criar tarefa
  */
  if (idModal == 0) {
    var html = document.getElementById(idtag).innerHTML;

    // Valida se a tag já está marcada
    if (html.includes('<div><span class="material-icons">check</span> </div>')) {

      document.getElementById(idtag).innerHTML = html.replace('<div><span class="material-icons">check</span> </div>', " ");

      // Acha o index da tag no vetor e deleta
      for (let index = 0; index < tagselecionadas.length; index++) {
        if (tagselecionadas[index] == idtag) {
          delete tagselecionadas[index]
          break;
        }
      }

      // Ordena o vetor e retira o último elemento, o qual está em branco devido o delete
      tagselecionadas.sort(function (a, b) { return a - b })
      tagselecionadas.pop()

    } else {

      document.getElementById(idtag).innerHTML = html + '<div><span class="material-icons">check</span> </div>';

      // Joga o id no vetor e ordena
      tagselecionadas.push(idtag);
      tagselecionadas.sort(function (a, b) { return a - b })

    }
  } else {
    var html = document.getElementById(idtag+"cad").innerHTML;

    // Valida se a tag já está marcada
    if (html.includes('<div><span class="material-icons">check</span> </div>')) {

      document.getElementById(idtag+"cad").innerHTML = html.replace('<div><span class="material-icons">check</span> </div>', " ");

      // Acha o index da tag no vetor e deleta
      for (let index = 0; index < tagselecionadas_cadTarefa.length; index++) {
        if (tagselecionadas_cadTarefa[index] == idtag) {
          delete tagselecionadas_cadTarefa[index]
          break;
        }
      }

      // Ordena o vetor e retira o último elemento, o qual está em branco devido o delete
      tagselecionadas_cadTarefa.sort(function (a, b) { return a - b })
      tagselecionadas_cadTarefa.pop()
      console.log(tagselecionadas_cadTarefa)
    } else {

      document.getElementById(idtag+"cad").innerHTML = html + '<div><span class="material-icons">check</span> </div>';

      // Joga o id no vetor e ordena
      tagselecionadas_cadTarefa.push(idtag);
      tagselecionadas_cadTarefa.sort(function (a, b) { return a - b })
      console.log(tagselecionadas_cadTarefa)
    }
  }

}

window.onload = function carregaTagsFiltradas() {
  tagselecionadas.length = 0

  function removeDuplicadas(a) {
    return a.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
    // retirado de: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
  }

  // Pega a string do campo value e transforma em array
  var inputTags = document.getElementById("tagsSelecionadas");
  var value = inputTags.getAttribute("value");
  tagselecionadas = value.split(",");
  tagselecionadas = removeDuplicadas(tagselecionadas);

  // Ordena o vetor. Caso o último valor seja em branco, remove ele
  tagselecionadas.sort(function (a, b) { return a - b })
  if (tagselecionadas[tagselecionadas.length - 1] == "") {
    tagselecionadas.pop()
  }

  // Marca como selecionadas as tags
  tagselecionadas.forEach(idtag => {
    var html2 = document.getElementById(idtag).innerHTML
    document.getElementById(idtag).innerHTML = html2 + '<div><span class="material-icons">check</span> </div>';
  });

}

// Joga o vetor para o campo value do input das tags no formulário e envia
function filtraTarefas() {

  document.getElementById("tagsSelecionadas").setAttribute('value', tagselecionadas.toString());

  document.getElementById('filtros').submit();

}

function criaTarefa() {
  document.getElementById("tagsSelecionadas_cadTarefa").setAttribute('value', tagselecionadas_cadTarefa.toString());

 document.getElementById('formCriaTarefa').submit();
}