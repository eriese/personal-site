setSize = function() {
  var size;

  if($("body").width() < 750) {
    $("table").css("display", "none");
    $(".info").css("width", "70%");
    $(".info").css("height", "");
    $(".tint").css("padding", "15px 0px");
  }
  else {
    if ($("body").width() < 1140) {
      $(".img").css("width", "95%");
      $(".description").css("width", "95%");
    }
    else {
      $(".img").css("width", "350px");
      $(".description").css("width", "450px");
    }
    size = $(window).width() * 0.15;
    $("table").css("display", "");
    $(".info").css("height", size);
    $(".info").css("width", size);
    $(".tint").css("padding-top", size / 2 - $(".text").height() / 2);
    if ($(".info")[0]) {
      var margin = $(".info").css("margin");
      var marginNum = margin.replace("px", "");
      $(".bottom").width(size + parseInt(marginNum) * 2);
    }
  };
  $("h1").parent().css("padding-top", $("h1").parent().height() / 2 - $("h1").height() / 2);
  // $("footer").css("margin-top", $(window).height() - $("footer").height());
}

setSize();
$(window).resize(setSize);
$(".footer").on("mouseover", function() {
  $(".footer").addClass("hover");
});
$(".footer").on("mouseout", function() {
  $(".footer").removeClass("hover");
});

$("#mouffe").on("click", function(e){
  var video = $("#mouffe")[0];
  if (video.paused) {
    $(".img").css("width", "95%");
    $("#mouffe").css({"width": "90%"});
    video.play();
  }
  else {
    video.pause();
    $(".img").css("width", "");
    $("#mouffe").css({"width": "100%"});
  }
} );
// switchout = function(e) {
//   e.preventDefault();
//   var url = alert($(this).find("a").attr("href"));
// };

// $(".info").click(switchout);
