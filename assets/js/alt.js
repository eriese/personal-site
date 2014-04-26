setSize = function() {
  var size;
//   if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//    $("table").css("display", "none");
//    $(".info").css("width", "70%");
//    $(".info").css("height", "");
//    $(".tint").css("padding", "15px 0px");
//    $(".img").css("width", "95%");
//    $(".description").css("width", "95%");
//  };
//  if($(window).width() < 750) {
//   $("table").css("display", "none");
//   $(".info").css("width", "70%");
//   $(".info").css("height", "");
//   $(".tint").css("padding", "15px 0px");
//   $(".img").css("width", "95%");
//   $(".description").css("width", "95%");
//   $("#up-arrow").css({"margin-top": "5px", "margin-left": "5px"});
//   $("#up-arrow img").width(30);
// }
if($(window).width() > 750) {
  // if ($("body").width() < 1140) {
  //   $(".img").css("width", "95%");
  //   $(".description").css("width", "95%");
  // }
  // else {
  //   $(".img").css("width", "350px");
  //   $(".description").css("width", "450px");
  // }
  size = $("body").width() * 0.15;
  // $("table").css("display", "");
  $(".info").css("height", size);
  $(".info").css("width", size);
  $(".tint").css("padding-top", size / 2 - $(".text").height() / 2);
  if ($(".info")[0]) {
    var margin = $(".info").css("margin");
    var marginNum = margin.replace("px", "");
    $(".bottom").width(size + parseInt(marginNum) * 2);
  }
}
else {
  $(".info").css("width", "70%");
  $(".info").css("height", "50px");
  $(".tint").css("padding", "15px 0px");
}

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

$(".info").on("mouseover", function(e){
  $(this).addClass("hover")
});
$(".info").on("mouseout", function(e){
  $(this).removeClass("hover")
});
// switchout = function(e) {
//   e.preventDefault();
//   var url = alert($(this).find("a").attr("href"));
// };
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46992121-1', 'enochriese.com');
  ga('send', 'pageview');

// $(".info").click(switchout);
