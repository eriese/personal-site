ARROWDIV = $("<div id='up-arrow'><a href='index.html'><img src='assets/images/arrow-up.png' alt='previous level'></a></div>")

setSize = function() {
  var size;
  if($(window).width() > 750) {
    size = $("body").width() * 0.15;
    $(".info").css("height", size);
    $(".info").css("width", size);
    $.each($(".tint"), function(index, div) {
      $(div).css("padding-top", $(div).height() / 2 - $(div).find(".text").height() / 2);
    });
    if ($(".info")[0]) {
      var margin = $(".info").css("margin");
      var marginNum = margin.replace("px", "");
      $(".bottom").width(size + parseInt(marginNum) * 2);
      $("#top").width($("#bottom").width());
    }
  }
  else {
    $(".info").css("width", "70%");
    $(".info").css("height", "50px");
    $(".tint").css("padding", "15px 0px");
  }

  $("h1").parent().css("padding-top", $("h1").parent().height() / 2 - $("h1").height() / 2);
}

var changeoutListener = function() {
  if ($(window).width() > 750 && !listenerCheck) {
    $(".info").click(infoClick);
    listenerCheck = true;
  }
  else if($(window).width() < 750 && listenerCheck) {
    $(".info").off();
    listenerCheck = false;
  };
  return listenerCheck;
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

$(window).on({ready: coverBases,
 resize: coverBases});
$(".footer").on("mouseover", function() {
  $(".footer").addClass("hover");
});
$(".footer").on("mouseout", function() {
  $(".footer").removeClass("hover");
});

var infoClick = function(e) {

  $thisDiv = $(this);
  if($thisDiv.find("a").attr("href").indexOf("http://") < 0) {
    e.preventDefault();
    var currHash = window.location.hash;
    var url = $thisDiv.find("a").attr("href").replace(".html", "");
    // debugger
    if (currHash == "") {
      window.location.hash = url;
    }
    else{
      window.location.hash = currHash + "/" + url;
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
// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// ga('create', 'UA-46992121-1', 'enochriese.com');
// ga('send', 'pageview');
var cache = {
  // If url is '' (no fragment), display this div's content.
  '': $('.default')
};
getPage = function(url) {
  var $thisDiv = $("a[href='" + url + ".html']").parent();
  $.ajax({
    url: url + ".html",
    type: "GET",
    dataType : "html",

  }).done(function(data) {
    var storageDiv = $("<div>");
    storageDiv.append(data);
    cache[url] = storageDiv;
    changeOut($thisDiv, storageDiv);
  });
}
$(window).on("hashchange", function(e) {
  var uncutUrl = window.location.hash.replace("#", "");
  var urlArray = uncutUrl.split("/");
  var url = urlArray.slice(-1)[0];
  var exists = $("a[href='" + url + ".html']")
  if (exists.length < 1) {
    $.each(urlArray, function(index, serialUrl) {
      setTimeout(function() {
      if (cache[serialUrl]) {
        var clickDiv = $("a[href='" + serialUrl + ".html']").parent();
        changeOut(clickDiv, cache[serialUrl]);
      }
      else {
        getPage(serialUrl);
      }
      }, 3550 * index);
    });
  }
  else if (exists.first().parent().hasClass("info")){
    if (cache[url]) {
      var clickDiv = $("a[href='" + url + ".html']").parent();
        changeOut(clickDiv, cache[url]);
    }
    else {
      getPage(url);
    }
  }
});

$(window).trigger("hashchange");


var changeOut = function($thisDiv, $newPage) {
  listenerCheck = false;
  var blankDiv = $newPage;
  var storageDiv = $("<div>");
  // blankDiv.append(data);
  var pos = $thisDiv.position();
  fixInfoDivs();
  var textContent = $thisDiv.find(".text").text();
  var backgroundClass = blankDiv.find(".name").attr("class");
  $thisDiv.addClass(backgroundClass)
  .removeClass("hover info")
  .css({"margin-left": 15})
  .find(".tint").html("<h1>" + textContent + "</h1>")
  .css({"padding-top": $thisDiv.height() / 2 - $thisDiv.find("h1").height() / 2});
  $thisDiv.animate({height: 200, width: 200, "margin-left": 11, "margin-top": 19}, 500, function() {
    $thisDiv.off()
    .find("a").attr("href", "index.html")
    $thisDiv.find(".tint").css({"padding-top": $thisDiv.height() / 2 - $thisDiv.find("h1").height() / 2});
    var everythingElse = $("body").children().not($thisDiv).not(".footer")
    $.when(everythingElse.fadeOut(300)).done(function() {
      $thisDiv.animate({top: 0, left: "50%", "margin-left": -100}, 700, function() {
        storageDiv.append(everythingElse.remove());
        $("body").prepend(blankDiv.find("#up-arrow").hide());
        $("#up-arrow").fadeIn();
        var table = blankDiv.find("table");
        var info = blankDiv.find(".info");
        var label = blankDiv.find(".label");
        table.addClass("to-scroll");
        $("body").append(table);
        // debugger
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
return storageDiv;
}



