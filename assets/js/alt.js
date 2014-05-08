setSize = function() {
  var size;
  if($(window).width() > 750) {
    size = $("body").width() * 0.15;
    $(".info").css({height: size, width: size});
    $.each($(".tint"), function(index, div) {
      $(div).css("padding-top", centerText($(div), ".text"));
    });
    if ($(".info")[0]) {
      var margin = $(".info").css("margin").replace("px", "");
      $(".bottom").width(size + parseInt(margin) * 2);
      $("#top").width($("#bottom").width());
    }
  }
  else {
    $(".info, .tint").removeAttr("style");
  }
  $("h1").parent().css("padding-top", centerText($("h1").parent(), "h1"));
}
var centerText = function($div, textSelector) {
  return ($div.height() - $div.find(textSelector).height()) / 2
}
var changeoutListener = function() {
  if ($(window).width() > 750 && !listenerCheck) {
    $(".info").click(infoClick);
    $("#up-arrow").click(infoClick);
    listenerCheck = true;
  }
  else if($(window).width() < 750 && listenerCheck) {
    $(".info").off();
    $("#up-arrow").off();
    listenerCheck = false;
  };
}
var addVideoListeners = function() {
  $("video").on("click", function(e){
    var video = $("video")[0];
    if (video.paused) {
      $(".img").css("width", "95%");
      $("video").css({"width": "90%"});
      video.play();
    }
    else {
      video.pause();
      $(".img").css("width", "");
      $("video").css({"width": "100%"});
    }
  });
}
var addInfoListeners = function() {
  $(".info").on({
    mouseover: function(e){
      $(this).addClass("hover");
    },
    mouseout: function(e){
      $(this).removeClass("hover");
    }
  });
}
listenerCheck = false;
var coverBases = function() {
  setSize();
  changeoutListener();
  addInfoListeners();
  addVideoListeners();
}
$(window).on({
  ready: coverBases,
  resize: coverBases,
});
$(".footer").on({
  mouseover: function() {
    $(".footer").addClass("hover");
  },
  mouseout: function() {
    $(".footer").removeClass("hover");
  }
});

var infoClick = function(e) {
  $thisDiv = $(this);
  if($thisDiv.find("a").attr("href").indexOf("http://") < 0) {
    e.preventDefault();
    var currHash = window.location.hash;
    var url = $thisDiv.find("a").attr("href").replace(".html", "");
    if (currHash == "") {
      window.location.hash = url;
    }
    else if ($thisDiv.hasClass("info")) {
      window.location.hash = currHash + "/" + url;
    }
    else {
      hashArray = currHash.split("/");
      hashArray.pop()
      window.location.hash = hashArray.join("/")
    }
  }
}
var fixInfoDivs = function() {
  posArray = []
  $.each($(".info"), function(index, div) {
    posArray.push($(div).position());
  });
  $.each($(".info"), function(index, div) {
    $(div).css({"position": "absolute"});
    $(div).css(posArray[index]);
  });
}
var getPage = function(url) {
  var $thisDiv = $("a[href='" + url + ".html']").parent();
  $.ajax({
    url: url + ".html",
    type: "GET",
    dataType : "html",
  }).done(function(data) {
    var storageDiv = $("<div>");
    storageDiv.append(data);
    changeOut($thisDiv, storageDiv);
  });
}
var changeOut = function($thisDiv, $newPage) {
  listenerCheck = false;
  var blankDiv = $newPage;
  fixInfoDivs();
  var textContent = $thisDiv.find(".text").text();
  var backgroundClass = blankDiv.find(".name").attr("class");
  $thisDiv.addClass(backgroundClass)
  .removeClass("hover info")
  .css({"margin-left": 15})
  .find(".tint").html("<h1>" + textContent + "</h1>")
  .css({"padding-top": centerText($thisDiv, "h1")});
  $thisDiv.animate({height: 200, width: 200, "margin-left": 11, "margin-top": 19}, 500, function() {
    $thisDiv.off()
    .find("a").attr("href", "index.html")
    .find(".tint").css({"padding-top": centerText($thisDiv, "h1")});
    var everythingElse = $("body").children().not($thisDiv).not(".footer")
    $.when(everythingElse.fadeOut(300)).done(function() {
      $thisDiv.animate({top: 0, left: "50%", "margin-left": -100}, 700, function() {
        everythingElse.remove();
        $("body").prepend(blankDiv.find("#up-arrow").hide());
        $("#up-arrow").fadeIn();
        var table = blankDiv.find("table");
        var info = blankDiv.find(".info");
        var label = blankDiv.find(".label");
        table.addClass("to-scroll");
        $("body").append(table);
        if (label.length > 0) {
          table.animate({height: 80}, 500, function() {
            table.removeClass("to-scroll");
            wrapper = label.find(".wrapper");
            wrapper.hide();
            $("body").append(label.hide());
            label.show();
            wrapper.slideDown(2000);
            coverBases();
          });
        }
        else {
          $("body").append(info.hide());
          var scrollWidth = ($("body").width() * 0.15 + parseInt($(".info").css("margin").replace("px", "")) * 2) * (info.length - 1);
          $("#top").animate({height: 80}, 500, function() {
            $("#left").animate({width: scrollWidth/2}, 500, function() {
              $("#top").removeClass("to-scroll");
              coverBases();
              $("#bottom").animate({height: 80}, 500, function() {
                info.fadeIn(500);
                setSize();
                addInfoListeners();
              });
            });
          });
        };
      });
    });
  });
}
$(window).on("hashchange", function(e) {
  var uncutUrl = window.location.hash.replace("#", "");
  if (uncutUrl == "") {uncutUrl = "index"};
  var urlArray = uncutUrl.split("/");
  var url = urlArray.slice(-1)[0];
  var exists = $("a[href='" + url + ".html']")
  if (exists.first().parent().attr("id")=="up-arrow" || url == "index") {
    var nameDiv = $(".name").first();
    var everythingElse = $("body").children().not($(".footer")).not(nameDiv);
    $.when(everythingElse.fadeOut(500)).done( function() {
      everythingElse.remove();
      $.ajax({
        url: url + ".html",
        type: "GET",
        dataType : "html",
      }).done(function(data) {
        var storageDiv = $("<div>");
        storageDiv.append(data);
        var newName = storageDiv.find(".name")
        var table = storageDiv.find("table");
        var info = storageDiv.find(".info");
        var upArrow = storageDiv.find("#up-arrow")
        $("body").append(newName).append(table).append(info).append(upArrow);
        coverBases();
        nameDiv.fadeOut(300, function() {
          nameDiv.remove();
          listenerCheck = false
          coverBases();
        });
      });
    });
  }
  else if (exists.length < 1) {
    $.each(urlArray, function(index, serialUrl) {
      setTimeout(function() {
          getPage(serialUrl);
      }, 3550 * index);
    });
  }
  else if (exists.first().parent().hasClass("info")){
      getPage(url);
  }
});
$(window).trigger("hashchange");



