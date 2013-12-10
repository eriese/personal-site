setSize = function() {
  var size;
  if ($(".info")[0]) {
    if($("body").width() < 750) {
      $("table").css("display", "none");
      $(".info").css("width", "70%");
      $(".info").css("height", "");
      $(".tint").css("padding", "15px 0px");
    }
    else {
      size = $(window).width() * 0.15;
      $("table").css("display", "");
      $(".info").css("height", size);
      $(".info").css("width", size);
      $(".tint").css("padding-top", size / 2 - $(".text").height() / 2);
      var margin = $(".info").css("margin");
      var marginNum = margin.replace("px", "");
      $(".bottom").width(size + parseInt(marginNum) * 2);
    };
  }
  $("h1").parent().css("padding-top", $("h1").parent().height() / 2 - $("h1").height() / 2);
  // $("footer").css("margin-top", $(window).height() - $("footer").height());
}

setSize();
$(window).resize(setSize);

// switchout = function(e) {
//   e.preventDefault();
//   var url = alert($(this).find("a").attr("href"));
// };

// $(".info").click(switchout);
