function teste() {
        console.log('Click');
        var foo = document.querySelector('.menuLateral, .menuLateralmostra');

        if (foo.classList.contains("menuLateral")) {
                foo.classList.replace("menuLateral","menuLateralmostra");
        } else {
                foo.classList.replace("menuLateralmostra","menuLateral");
        }
        
}