var miColor = $('.main-titulo').css('color');
var min = 2;
var seg = 0;
var ori = "";
var dst = "";

if (sessionStorage.getItem("iniciado")){}else{sessionStorage.setItem("iniciado", 0)};

setInterval(function(){tiempo()}, 100);

function tiempo() {
    if(miColor == 'rgb(220, 255, 14)') {
        miColor = 'rgb(255, 255, 255)'
    } else {
        miColor = 'rgb(220, 255, 14)'
    };
    $('.main-titulo').css('color', miColor);
    if (sessionStorage.getItem("iniciado")==1){
        if (seg <= 0) {
            if (min <= 0) {
                    min = 2;
                    seg = 0;
                    sessionStorage.setItem("iniciado", 0);
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
  if (sessionStorage.getItem("iniciado")==1){
    
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
    sessionStorage.setItem("iniciado", 1);
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
      if(dst != ori) {
        $("#" + $("#" + dst + " > div").attr("id")).appendTo($("#" + ori));
        $(ui.draggable)
          .css({left: "auto", top: "auto"})
          .appendTo($(this))
      };
    }
  });
});

// Julian Toledo - 20200708 10:30 +/-
