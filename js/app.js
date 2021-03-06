var clr = $('.main-titulo').css('color'); //Color inicial de la etiqueta "Match Game" que permanecerá alternando durante la presentación de la página.
var min = 2;  //Minutos (valor inicial y máximo pues al inicial el juego se reinicia a cero)
var seg = 0;  //Segundos (valor inicial)
var dsp = 0;  //Despalzamiento solicitado para un elemento entre su posición de origen y la de destino
var ori = ""; //Almacena la referencia a la posición de origen de un elemento
var dst = ""; //Almacena la referencia a la posición de destino de un elemento
var col = []; //Lista dulces en una columna
var mtz = []; //Matriz con el contenido del tablero
var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;
var blnk;
var dlcx;
var tmr1;

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
  let dulce = 0;
  if (ini == true){col = [];}
  for (var i = 0; i <= 6; i++) {
    dulce = enteroAleatorio(1, 5);

    if (i > 1 && mtz.length > 2){
      while ((dulce == mtz[mtz.length-1][i] && dulce == mtz[mtz.length-2][i]) || (dulce == col[i-1] && dulce == col[i-2]))
      {dulce = enteroAleatorio(1, 5)};
    }else{
      if (i > 1){
        while (dulce == col[i-1] && dulce == col[i-2])
        {dulce = enteroAleatorio(1, 5);};
      }else{
        if (mtz.length > 2){
          while (dulce == mtz[mtz.length-1][i] && dulce == mtz[mtz.length-2][i])
          {dulce = enteroAleatorio(1, 5)};
        }
      }
    };
    $(obj).append('<div id="a' + $(obj).attr("class") + i + '" class="elemento"><div id="b' + $(obj).attr("class") + i + '" class="draggable dulce' + dulce + '"></div></div>');
    col.push(dulce);
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
  let mbk = []; //Copia temporal de la matriz para evaluar y validar coincidencia de elementos tras movimientos
  //Asignamos los valores a la matriz evitando la asignación por referencia.
  for (var i = 0; i < 7; i++){
    mbk.push(mtz[i].slice())
  };
  //Realizamos el intercambio de piezas del último movimiento que hizo el usuario
  let pvt = mtz[x1][y1];
  mtz[x1][y1] = mtz[x2][y2];
  mtz[x2][y2] = pvt;
  //Verificamos los elemento de la matriz para identificar los casos en que hayan coincidencias
  if (verificarMatriz()){
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
    for (var i = 0; i < 7; i++){
    for (var j = 0; j < 7; j++){
      if (i < 5){
        if (xmz[i][j] === xmz[i+1][j] && xmz[i][j] === xmz[i+2][j]){
          omt[i][j] = 0;
          omt[i+1][j] = 0;
          omt[i+2][j] = 0;
          $('#score-text').text(Number($('#score-text').text()) + 30);
          ok = true;
        };
      }
      if (j < 5){
        if (xmz[i][j] === xmz[i][j+1] && xmz[i][j] === xmz[i][j+2]){
          omt[i][j] = 0;
          omt[i][j+1] = 0;
          omt[i][j+2] = 0;
          $('#score-text').text(Number($('#score-text').text()) + 30);
          ok = true;
        };
      }
    };
  };
  mtz = omt;
  return ok;
};

function iniciarJuego() {
  if (sessionStorage.getItem("jugando")==1){
    llenarMatriz(true);
    $('#btn-reinicio').text('Reiniciar');
  }
};

function quitarDulces(){
  for (var i = 0; i < 7; i++){
    for (var j = 0; j < 7; j++){
      if (mtz[i][j] == 0){
        let dulce = $("#acol-"+(i+1)+j).find(".draggable");
        dulce.addClass("byeBlinking");
      };
    };
  };
  blnk = 1;
  tmr1 = setInterval(() => byeBlinking(), 200);
};

function byeBlinking(){
  if (blnk == 1 || blnk == 3){
    $(".byeBlinking").css("opacity", 0.2);
    blnk += 1;
  }else if(blnk == 2 || blnk == 4){
    $(".byeBlinking").css("opacity", 1);
    blnk += 1;
  }else if(blnk == 5){
    $(".byeBlinking").css("opacity", 0);
    $(".byeBlinking").removeClass("byeBlinking");
    clearInterval(tmr1);

    //Recorro la matriz asignando valores a los que tienen cero y los hago visibles
    let dulce = 0;
    let divab;

    for (var i = 0; i < 7; i++){
      for(var j = 0; j < 7; j++){
        if(mtz[i][j] == 0){
          dulce = enteroAleatorio(1, 5);
          mtz[i][j] = dulce;
          divab = $("#acol-"+(i+1)+j).find(".draggable");
          divab.removeClass("dulce1");
          divab.removeClass("dulce2");
          divab.removeClass("dulce3");
          divab.removeClass("dulce4");
          divab.addClass("dulce"+dulce);
          divab.css("opacity", 1);
          divab.hide(100);
          divab.show(100);
        };
      };
    };
    verificarMatriz();
    quitarDulces();
  };
};

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
      if(dst != ori && dsp == 1) {  //Limitamos los movimientos a un espacio sin permitir movimientos en diagonal.
        actualizarMatriz();
        $("#" + $("#" + dst + " > div").attr("id")).appendTo($("#" + ori));
        $(ui.draggable)
          .css({left: "auto", top: "auto"})
          .appendTo($(this));
        quitarDulces();
      };
    }
  });
});

// Julian Toledo - 20210121 23:00 +/-
