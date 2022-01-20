var tagselecionadas = []

function listaTags(tagsSelecionadas, tagsProjeto) {
  tagsProj = tagsProjeto.trim().split(" ");
  tagsSelec = tagsSelecionadas.trim().split(" ");

  for (var i = 0; i < tagsProj.length; i++) {

  }

  if (tagsSelec.length > 0) {
    for (var i = 0; i < tagsSelec.length; i++) {

    }
  }

}

window.onload = carregaTagsFiltradas();

function carregaTagsFiltradas() {
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
  tagselecionadas = value.trim().split(" ");
  tagselecionadas = removeDuplicadas(tagselecionadas);

  console.log(tagselecionadas)

  // Ordena o vetor. Caso o último valor seja em branco, remove ele
  tagselecionadas.sort(function (a, b) { return a - b })
  if (tagselecionadas[tagselecionadas.length - 1] == "") {
    tagselecionadas.pop()
  }

  // Marca como selecionadas as tags
  tagselecionadas.forEach(idtag => {
    var html2 = document.getElementById("tag" + idtag).innerHTML
    document.getElementById("tag" + idtag).innerHTML = html2 + '<div><span class="material-icons">check</span> </div>';
  });

}

function selecionatag(idtag) {
  var html = document.getElementById("tag" + idtag).innerHTML;

  // Valida se a tag já está marcada
  if (html.includes('<div><span class="material-icons">check</span> </div>')) {

    document.getElementById("tag"+idtag).innerHTML = html.replace('<div><span class="material-icons">check</span> </div>', " ");

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
    console.log(tagselecionadas)
  } else {

    document.getElementById("tag"+idtag).innerHTML = html + '<div><span class="material-icons">check</span> </div>';

    // Joga o id no vetor e ordena
    tagselecionadas.push(idtag);
    tagselecionadas.sort(function (a, b) { return a - b })
    console.log(tagselecionadas)
  }
}

function editaTags() {

  document.getElementById("tagsSelecionadas").setAttribute('value', tagselecionadas.toString());

  document.getElementById('tags').submit();

}