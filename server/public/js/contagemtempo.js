window.onload = function init() {
var table = document.getElementById("tablecontatempo");
var lastRowIndex = table.rows.length-1;
var lastCellIndex = table.rows[lastRowIndex].cells.length-1;

if (table.rows[lastRowIndex].cells[lastCellIndex].innerHTML == "") {
  document.getElementById("btn_contatempo").innerHTML = "Parar contagem"
}
}
