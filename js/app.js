var miColor = $('.main-titulo').css('color');
var min = 2;
var seg = 0;
var jugando = 0;

setInterval(function(){tiempo()}, 50);

function tiempo() {
    if(miColor == 'rgb(220, 255, 14)')
        {miColor = 'rgb(255, 255, 255)'}
    else
        {miColor = 'rgb(220, 255, 14)'};
    $('.main-titulo').css('color', miColor);
    if (jugando==1){
        if (seg <= 0) {
            if (min <= 0) {
                    min = 2;
                    seg = 0;
                    jugando = 0;
            } else {
                    min -= 1;
                    seg = 59;
            };
        } else {
            seg -= 1
        };
        if (seg > 9) {
            document.getElementById("timer").textContent = "0" + min + ":" + seg;
        } else {
            document.getElementById("timer").textContent = "0" + min + ":0" + seg;
        };
    };
};

function enteroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

function iniciarJuego() {
    jugando = 1;
    var filas = 6;
	var columnas = $('[class^="col-"]');

    columnas.each(
        function () {
            var dulces = $(this).children().length;
            var agrega = filas - dulces;
            for (var i = 0; i < agrega; i++) {
                var dulceTipo = enteroAleatorio(1, 5);
                $(this).append('<img src="image/' + dulceTipo + '.png" class="element"></img>');
            };
        }
    );
};

$(function() {
	$('.btn-reinicio').click(function () {
        if (jugando == 0){
            iniciarJuego();
        } else {
            jugando = 0;
        };
	});
});
