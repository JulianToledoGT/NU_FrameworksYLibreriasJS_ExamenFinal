var miColor = $('.main-titulo').css('color'); //Color Inicial de la etiqueta "Match Game" que permanecerá alternando durante la presentación de la página.
var min = 2;  //Minutos (valor inicial y máximo pues al inicial el juego se reinicia a cero)
var seg = 0;  //Segundos (valor inicial)
var ori = ""; //Almacena la referencia a la posición de origen de un elemento
var dst = ""; //Almacena la referencia a la posición de destino de un elemento
var dsp = 0;  //Despalzamiento solicitado para un elemento entre su posición de origen y la de destino

if (sessionStorage.getItem("jugando")){}else{sessionStorage.setItem("jugando", 0)};

setInterval(function(){tiempo()}, 100);

function tiempo() {
    if(miColor == 'rgb(220, 255, 14)') {
        miColor = 'rgb(255, 255, 255)'
    } else {
        miColor = 'rgb(220, 255, 14)'
    };
    $('.main-titulo').css('color', miColor);
    if (sessionStorage.getItem("jugando")==1){
        if (seg <= 0) {
            if (min <= 0) {
                    min = 2;
                    seg = 0;
                    sessionStorage.setItem("jugando", 0);
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
  if (sessionStorage.getItem("jugando")==1){
    
    var columnas = $('[class^="col-"]');

    columnas.each(function() {
      for (var i = 0; i < 6; i++) {
        var color = enteroAleatorio(1, 5);
        $(this).append('<div id="a' + $(this).attr("class") + i + '" class="elemento"><div id="b' + $(this).attr("class") + i + '" class="draggable dulce' + color + '"></div></div>');
      };
    });
  }
};

$(function() {
  iniciarJuego();

	$('.btn-reinicio').click(function(){
    sessionStorage.setItem("jugando", 1);
    location.reload();
  });

  $(".draggable").draggable({
    revert: true,
    drag: function(event, ui){
      $(ui.draggable)
      ori = $(this).parent().attr("id")
    }
  });

  $(".elemento").droppable({
    accept: ".draggable",
    drop: function(event, ui) {
      dst = $(this).attr("id")
      //Determino el desplazamiento para el elemento sabiendo que he identificado cada contenedor
      // con un número correlativo tanto de columna como de fila, por lo que mediante la obtención
      // de la diferencia entre la posición de origen y la de destino, puedo determinar
      // cuántos espacios se desplazaría el elemento y permito que se realice solo cuando este valor sea igual a uno.
      dsp = Math.abs(parseInt(ori.substring(5, 6))-parseInt(dst.substring(5, 6)))
          + Math.abs(parseInt(ori.substring(6, 7))-parseInt(dst.substring(6, 7)))
      if(dst != ori && dsp == 1) {
        $("#" + $("#" + dst + " > div").attr("id")).appendTo($("#" + ori));
        $(ui.draggable)
          .css({left: "auto", top: "auto"})
          .appendTo($(this))
      };
    }
  });
});

// Julian Toledo - 20200708 11:20 +/-
