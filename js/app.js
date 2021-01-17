var clr = $('.main-titulo').css('color'); //Color inicial de la etiqueta "Match Game" que permanecerá alternando durante la presentación de la página.
var min = 2;  //Minutos (valor inicial y máximo pues al inicial el juego se reinicia a cero)
var seg = 0;  //Segundos (valor inicial)
var dsp = 0;  //Despalzamiento solicitado para un elemento entre su posición de origen y la de destino
var ori = ""; //Almacena la referencia a la posición de origen de un elemento
var dst = ""; //Almacena la referencia a la posición de destino de un elemento
var col = []; //Lista dulces en una columna
var mtz = []; //Matriz con el contenido del tablero
var mbk = []; //Copia temporal de la matriz para evaluar y validar coincidencia de elementos tras movimientos
var mmz = [];
var pvt = 0;
var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;
 
if (sessionStorage.getItem("jugando")){}else{sessionStorage.setItem("jugando", 0)};

setInterval(function(){tiempo()}, 1000);

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
  let num = 6;
  let dulce = 0;
  if (ini == true){col = [];}
  for (var i = 0; i <= num; i++) {
    dulce = enteroAleatorio(1, 5);
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

function actualizarMatriz(){
  mbk = mtz;
  //Realizamos el intercambio de piezas del último movimiento que hizo el usuario
  pvt = mtz[x1][y1];
  mtz[x1][y1] = mtz[x2][y2];
  mtz[x2][y2] = pvt;
  //Verificamos los elemento de la matriz para identificar los casos en que hayan coincidencias
  if (verificarMatriz()){
    //Si el movimiento es válido, desplazar los elementos del tablero e incrementar el contador de movimiento
    $('#movimientos-text').text(Number($('#movimientos-text').text()) + 1);
  }else{
    mtz = mbk;  //Si el movimiento no es válido, restablecemos los valores de las posiciones en los elementos
  };
};

function verificarMatriz(){
  let ok = false;
  let omt = [];
  let xmz = [];
  
  //Asignamos los valores a la matriz evitando la asignación por referencia.
  for (var i = 0; i < 7; i++){
    omt.push(mtz[i].slice())
  };
  for (var i = 0; i < 7; i++){
    xmz.push(mtz[i].slice())
  };
  
  console.log('xmz1\n');
  console.log(xmz[0].map((_, c4) => xmz.map(row => row[c4])));
  for (var i = 0; i < 7; i++){
    for (var j = 0; j < 7; j++){
      if (i < 5){
        if (xmz[i][j] === xmz[i+1][j] && xmz[i][j] === xmz[i+2][j]){
          omt[i][j] = 0;
          omt[i+1][j] = 0;
          omt[i+2][j] = 0;
          ok = true;
        };
      }
      if (j < 5){
        if (xmz[i][j] === xmz[i][j+1] && xmz[i][j] === xmz[i][j+2]){
          omt[i][j] = 0;
          omt[i][j+1] = 0;
          omt[i][j+2] = 0;
          ok = true;
        };
      }
    };
  };
  console.log('omt2\n');
  console.log(omt[0].map((_, c4) => omt.map(row => row[c4])));
  mmz = omt;
  return ok;
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
      x1 = parseInt(ori.substring(5, 6))-1;
      x2 = parseInt(dst.substring(5, 6))-1;
      y1 = parseInt(ori.substring(6, 7));
      y2 = parseInt(dst.substring(6, 7));
      dsp = Math.abs(x1-x2) + Math.abs(y1-y2);
      if(dst != ori && dsp == 1) {  //Limitamos los movimientos a un espacio sin permitir movimientos en ddiagonal.
        actualizarMatriz();
        $("#" + $("#" + dst + " > div").attr("id")).appendTo($("#" + ori));
        $(ui.draggable)
          .css({left: "auto", top: "auto"})
          .appendTo($(this))
      };
    }
  });
});

// Julian Toledo - 20210117 14:30 +/-
