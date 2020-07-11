var clr = $('.main-titulo').css('color'); //Color inicial de la etiqueta "Match Game" que permanecerá alternando durante la presentación de la página.
var min = 2;  //Minutos (valor inicial y máximo pues al inicial el juego se reinicia a cero)
var seg = 0;  //Segundos (valor inicial)
var dsp = 0;  //Despalzamiento solicitado para un elemento entre su posición de origen y la de destino
var ori = ""; //Almacena la referencia a la posición de origen de un elemento
var dst = ""; //Almacena la referencia a la posición de destino de un elemento
var mtz = []; //Matriz con el contenido del tablero
var col = []; //Lista dulces en una columna

if (sessionStorage.getItem("jugando")){}else{sessionStorage.setItem("jugando", 0)};

setInterval(function(){tiempo()}, 100);

function tiempo() {
  if(clr == 'rgb(220, 255, 14)') {
    clr = 'rgb(255, 255, 255)'
  } else {
    clr = 'rgb(220, 255, 14)'
  };
  $('.main-titulo').css('color', clr);
  if (sessionStorage.getItem("jugando")==1){
    if (seg <= 0) {
      if (min <= 0) {
        min = 2;
        seg = 0;
        sessionStorage.setItem("jugando", 0);
        finalizaJuego();
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

function llenarColumna(obj, ini) {
//TODO: Agregar animación para que parezca que los duclces están descendiendo  
  let num = 7
  if (ini == true){col = [];}
  for (var i = 0; i < num; i++) {
    let dulce = enteroAleatorio(1, 5);
    $(obj).append('<div id="a' + $(obj).attr("class") + i + '" class="elemento"><div id="b' + $(obj).attr("class") + i + '" class="draggable dulce' + dulce + '"></div></div>');
    col.push(dulce)
  };
};

function llenarMatriz(ini) {
  if (ini == true){mtz = [];}
  var columnas = $('[class^="col-"]');
  columnas.each(function() {
    llenarColumna(this, ini);
    mtz.push(col);
  });
};

function verificarMatriz(){
//TODO: recorrer la matriz y verificar si hay elementos qué eliminar (que generarán puntajes)
//TODO: ir marcando los objetos del tablero y marcar las posiciones relacionadas a elementos eliminados (agregar una clase)
//TODO: eliminar los objetos marcados con la clase (debe usarse una animación)
//TODO: recorrer nuevamente la matriz y eliminar las posiciones marcadas
//TODO: recorrer el listado de columnas y para cada una agregar el número de objetos restantes (debe aplicarse una animación para el desplazamiento de los objetos que desciendan)
};

function iniciarJuego() {
  if (sessionStorage.getItem("jugando")==1){
    llenarMatriz(true);
    $('#btn-reinicio').text('Reiniciar');
  }
};

//para obtener todos los dulces de una columna (no una fila)
//mtz.map(function(value,index) { return value[2]; })
//$(this).append('<div id="a' + $(this).attr("class") + i + '" class="elemento"><div id="b' + $(this).attr("class") + i + '" class="draggable dulce' + dulce + '"></div></div>');

function finalizaJuego() {
	$("div.panel-tablero, div.time").effect("fold");
	$("h1.main-titulo").addClass('title-over')
		.text('Juego Terminado');
	$("div.score, div.moves, div.panel-score").width('100%');
};

$(function() {
  iniciarJuego();

  $('#btn-reinicio').click(function(){
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
      dst = $(this).attr("id");
      //Determino el desplazamiento para el elemento sabiendo que he identificado cada contenedor
      // con un número correlativo tanto de columna como de fila, por lo que mediante la obtención
      // de la diferencia entre la posición de origen y la de destino, puedo determinar
      // cuántos espacios se desplazaría el elemento y permito que se realice solo cuando este valor sea igual a uno.
      //Lo anterior también quiere decir que no permitimos movimientos en diagonal.
      dsp = Math.abs(parseInt(ori.substring(5, 6))-parseInt(dst.substring(5, 6)))
          + Math.abs(parseInt(ori.substring(6, 7))-parseInt(dst.substring(6, 7)));
      if(dst != ori && dsp == 1) {
        var pnt = Number($('#movimientos-text').text()) + 1;
        $('#movimientos-text').text(pnt);
//TODO: También necesito intercabiar el valor del contenido de la matriz        
        $("#" + $("#" + dst + " > div").attr("id")).appendTo($("#" + ori));
        $(ui.draggable)
          .css({left: "auto", top: "auto"})
          .appendTo($(this))
        };
    }
  });
});

// Julian Toledo - 20200711 00:45 +/-
