var tagselecionadas = [];

// Função chamada ao clicar em uma tag
function selecionatag(idtag) {
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

}

function filtraTarefas() {

  document.getElementById("tagsSelecionadas").setAttribute('value',tagselecionadas.toString());
  
  document.getElementById('filtros').submit();

}