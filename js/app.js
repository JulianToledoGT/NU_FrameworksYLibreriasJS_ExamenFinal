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
  //console.log(mtz[0].map((_, c4) => mtz.map(row => row[c4])));
  return ok;
};

function iniciarJuego() {
  if (sessionStorage.getItem("jugando")==1){
    llenarMatriz(true);
    $('#btn-reinicio').text('Reiniciar');
  }
};

function quitarDulces(){
  //Si el movimiento es válido,
    //ocultar los objetos que coincidan con las posiciones de la matriz en cero,
    for (var i = 0; i < 7; i++){
    for (var j = 0; j < 7; j++){
      if (mtz[i][j] == 0){
        let dulce = $("#acol-"+(i+1)+j).find(".draggable");
        dulce.hide(1000, 'linear');
      };
    };
  };

  //Si el movimiento es válido,
    //recorrer la matriz,
      //intercambiar el contenido de los contenedores con posición cero con el inmediato superior y también los valores de la matriz
      //reiterar la instrucción anterior hasta asegurarnos que no haya un elemento cero con un elemento superior diferente a cero
/*
  let d1;
  let d2;
  
  for (var i = 0; i < 7; i++){
    for (var j = 6; j > 0; j--){
      for (var k = 6; k > 0; k--){
        if(mtz[i][k] === 0){
          mtz[i][k] = mtz[i][k-1];
          mtz[i][k-1] = 0;

          d1 = $("#acol-"+i+k).find(".draggable");
          d2 = $("#acol-"+i+(k-1)).find(".draggable");

          $("#" + d1.attr("id")).remove();
          $("#" + d2.attr("id")).remove();
          $("#acol-"+i+(k-1)).append(d1);
          $("#acol-"+i+(k-1)).append(d2);
          //console.log('el contenido de "acol-' +i+k+ '" se trasladará a "acol-' +i+(k-1)+ '"');
          //console.log(a.attr("id")+ " -- " + b.attr("id"));

        // $("#" + $("#" + dst + " > div").attr("id")).appendTo($("#" + ori));
        // $(ui.draggable)
        //   .css({left: "auto", top: "auto"})
        //   .appendTo($(this));


        };
      };
    };        
  };
*/    
  console.log(mtz[0].map((_, c4) => mtz.map(row => row[c4])));

  //recorrer la matriz
    //remplazar los valores cero (por otros obtenidos al azar)
    //mostrar el contenido de los contenedores



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
      //console.log(ori+'\n'+dst);
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

// Julian Toledo - 20210119 22:40 +/-

/*
var rowi = 6;

let dlcx = $("#acol-4"+rowi).find(".draggable");
dlcx.hide(200);

var tmr1 = setInterval(() => moveup(), 200);

function moveup(){
    console.log(1);
    if(rowi > 0){
        let dlca = $("#acol-4"+rowi).find(".draggable");
        let dlcb = $("#acol-4"+(rowi-1)).find(".draggable");
        dlca.remove();
        dlcb.remove();
        $("#acol-4"+rowi).append(dlcb);
        $("#acol-4"+(rowi-1)).append(dlca);
        rowi -= 1;
    }else{
        clearInterval(tmr1);
    };
};
*/

/*
var blink = 1;
var tmr2 = setInterval(() => byeBlinking(), 100);

function byeBlinking(){
    if (blink == 1 || blink == 3){
        $("#bcol-62").css("opacity", 0.2);
        blink += 1;
    }else if(blink == 2 || blink == 4){
        $("#bcol-62").css("opacity", 1);
        blink += 1;
    }else if(blink == 5){
        $("#bcol-62").css("opacity", 0);
        clearInterval(tmr2);
    }
};
*/
