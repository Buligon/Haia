/* function abreMenu() {
        var foo = document.querySelector('.menuLateral, .menuLateralmostra');

        if (foo.classList.contains("menuLateral")) {
                foo.classList.replace("menuLateral","menuLateralmostra");
        } else {
                foo.classList.replace("menuLateralmostra","menuLateral");
        }

} */

function abreMenu(event) {
        var htmlContent = '';


        switch (event.target.value) {
                case 'A': {
                        
                        htmlContent = "<h1>tyeste</h1>";
                        break;
                }
                case 'B': {
                        htmlContent = "content for B";
                        break;
                }
        }
        document.getElementById('menuLatS').innerHTML = htmlContent;
}