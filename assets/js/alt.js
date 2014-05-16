setSize = function() {
  // make layout responsive.
  // most of the responsiveness is in css,
  // but re-sizing the chart layout on window resize
  // is done through jquery
  var size;
  if($(window).width() > 750) {
    size = $("body").width() * 0.15;
    // set info divs to sizexsize to keep them circular
    $(".info").css({height: size, width: size});
    // recenter text
    $.each($(".text"), function(index, div) {
      centerText($(div).parent());
    });
    if ($(".info")[0]) {
      // re-align graph if there is one
      var margin = $(".info").css("margin").replace("px", "");
      $(".bottom").width(size + parseInt(margin) * 2);
      $("#top").width($("#bottom").width());
    }
  }
  else {
    // undo all jquery-added styling so that
    // stylesheet can take control
    $(".info, .tint").removeAttr("style");
  }
  // recenter the title text regardless of window size
  centerText($(".name"));
}
var centerText = function(div) {
  //calculate the necessary padding-top height for text to be centered and set it
  debugger
  var toCenter;
  if(div.hasClass("tint")) {
    toCenter = div;
  }
  else {
    toCenter = div.find(".tint");
  }
  toCenter.css( "padding-top", (div.height() - div.find(".text").height()) / 2);
}
listenerCheck = false;
var changeoutListener = function() {
  // only attach listeners in fullscreen view.
  // page without AJAX in mobile.
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
var coverBases = function() {
  //single call to make sure everything is properly sized and set
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
  // this function is separate from the info listeners
  // because they can be called at different times
  mouseover: function() {
    $(".footer").addClass("hover");
  },
  mouseout: function() {
    $(".footer").removeClass("hover");
  }
});

var infoClick = function(e) {
  // this is where the history happens
  $thisDiv = $(this);
  //check if the link is to an external source or internal
  //if internal:
  if($thisDiv.find("a").attr("href").indexOf("http://") < 0) {
    e.preventDefault();
    var currHash = window.location.hash;
    var url = $thisDiv.find("a").attr("href").replace(".html", "");
    if (currHash == "") {
      //if the hash is blank, the url can go right onto the hash
      window.location.hash = url;
    }
    else if ($thisDiv.hasClass("info")) {
      // if there's already something in the hash,
      // a click on an info div will go downwards in the hierarchy.
      // therefore, urls should stack in the hash in a separable way.
      window.location.hash = currHash + "/" + url;
    }
    else {
      // if there's something in the hash and an info div hasn't been clicked,
      // that means the up or back button has been clicked.
      // therefore, we need to remove the last url on the hash to go backwards.
      hashArray = currHash.split("/");
      hashArray.pop()
      window.location.hash = hashArray.join("/")
    }
  }
}
var fixInfoDivs = function() {
  // changing the positioning to absolute will move the info divs
  // from their current positions. to prevent this, we need to gather
  // the positions of each info div...
  posArray = []
  $.each($(".info"), function(index, div) {
    posArray.push($(div).position());
  });
  // and assign those positions back to them after
  // changing their position type
  $.each($(".info"), function(index, div) {
    $(div).css({"position": "absolute"});
    $(div).css(posArray[index]);
  });
}
var changeDown = function(url) {
  // this is the animation and ajax
  // for going downwards in the chart hierarchy
  // goal is to expand and fill the clicked element
  // so that it can then slide into place as the root,
  // then the chart lines grow down from it
  // and the info in that category fades in.

  // first get the information about the requested page
  var $thisDiv = $("a[href='" + url + ".html']").parent();
  $.ajax({
    url: url + ".html",
    type: "GET",
    dataType : "html",
  }).done(function(data) {
    // in order to use the returned html data as
    // an easy-to-manipulate JQuery object,
    // it needs to all be appended to a holder div
    var blankDiv = $("<div>");
    blankDiv.append(data);

    // the info divs that had listeners on them have been removed.
    // listeners need to reset
    listenerCheck = false;

    // position: relative items are hard to animate.
    // if I made just the one div I need to move position: absolute,
    // the others would move to maintain proper centering,
    // which is not part of the visual effect I am trying to create.
    // To prevent this, I fix all the divs in place.
    // I do not do have them permanently like this because
    // it would then take more code to maintain responsiveness.
    fixInfoDivs();

    // find the class of the name div in the ajaxed page
    // to assign appropriate background image
    var backgroundClass = blankDiv.find(".name").attr("class");
    $thisDiv.addClass(backgroundClass)
    .removeClass("hover info")
    // set margins to stay consistent with info div
    // now that it's no longer following info css
    .css({"margin-left": 15})
    // grow div to size of name div, change margins
    // so it appears to grow in place
    .animate({height: 200, width: 200, "margin-left": 11, "margin-top": 19}, 500, function() {
      centerText($thisDiv)
      // turn off click listener on this div;
      // it is no longer and info div and
      // shouldn't have the same click behavior
      $thisDiv.off()
      // change link to index to maintain convention
      .find("a").attr("href", "index.html")
      var everythingElse = $("body").children().not($thisDiv).not(".footer")
      // use a .done() to prevent multiple calls
      // to the same function for each item in everythingElse
      $.when(everythingElse.fadeOut(300)).done(function() {
        // once everythingElse is gone,
        // slide new name div into position
        $thisDiv.animate({top: 0, left: "50%", "margin-left": -100}, 700, function() {
          // clear html clutter
          everythingElse.remove();
          //find all necessary parts within ajaxed html
          var table = blankDiv.find("table");
          var info = blankDiv.find(".info");
          var label = blankDiv.find(".label");
          var arrow = blankDiv.find("#up-arrow");
          $("body").prepend(arrow.hide());
          arrow.fadeIn();
          // the to-scroll css class makes the table elements tiny
          // so that they can be animated to seem
          // to draw themselves outward
          table.addClass("to-scroll");
          $("body").append(table);
          if (label.length > 0) {
            // if there is a label instead of info divs,
            // there is only one table element to draw downward
            table.animate({height: 80}, 500, function() {
              table.removeClass("to-scroll");
              // to create the unfurling effect on the label,
              // the wrapper needs to be hidden separately so that
              // the label can come in separately from its contents.
              wrapper = label.find(".wrapper");
              wrapper.hide();
              $("body").append(label.hide());
              label.show();
              wrapper.slideDown(2000);
              // always call cover bases at the end.
              // it does what it says.
              coverBases();
            });
          }
          else {
            // if there is no label, there are info divs
            $("body").append(info.hide());
            // this hideous calculation matches
            // the one used in setSize to find the
            // necessary table width. We cannot call setSize
            // because setting the table size would skip animation.
            var scrollWidth = ($("body").width() * 0.15 + parseInt($(".info").css("margin").replace("px", "")) * 2) * (info.length - 1);
            // first draw the table down...
            $("#top").animate({height: 80}, 500, function() {
              // then outward
              $("#left").animate({width: scrollWidth/2}, 500, function() {
                $("#top").removeClass("to-scroll");
                // We must call setSize() here so that the
                // .bottom graph spaces properly
                setSize();
                $("#bottom").animate({height: 80}, 500, function() {
                  info.fadeIn(500);
                  coverBases()
                });
              });
            });
          };
        });
      });
    });
  });
}
var changeUp = function(url) {
  // this is the animation and ajax for going upwards
  // in the chart hierarchy

  // first get the information about the requested page
  $.ajax({
    url: url + ".html",
    type: "GET",
    dataType : "html",
  }).done(function(data) {
    // ANIMATION STILL UNDER CONSTRUCTION
    var nameDiv = $(".name").first();
    var everythingElse = $("body").children().not($(".footer")).not(nameDiv);
    var storageDiv = $("<div>");
    storageDiv.append(data);
    $.when(everythingElse.fadeOut(500)).done( function() {
      everythingElse.remove();
      var textToFind = nameDiv.text().trim();
      var newName = storageDiv.find(".name").css({opacity: 0});
      var table = storageDiv.find("table").css({opacity: 0});
      var info = storageDiv.find(".info").css({opacity: 0});
      var upArrow = storageDiv.find("#up-arrow").css({opacity: 0});
      $("body").append(newName).append(table).append(info).append(upArrow);
      coverBases();
      var newPos = $(".info:contains('" + textToFind + "')").position();
      debugger
      nameDiv.removeClass().addClass("info");
      setSize();
      debugger
      nameDiv.animate({top: newPos.top, left: newPos.left, "margin-left": 15, "margin-top": 15}, 1500, function() {
        nameDiv.fadeOut(300, function() {
          nameDiv.remove();
        });
        listenerCheck = false
        coverBases();
        $(".info").animate({opacity: 1}, 500, function() {
          coverBases();
          $("table").animate({opacity: 1}, 500, function() {
            coverBases();
            $(".name").animate({opacity: 1}, 500);
            $("#up-arrow").animate({opacity: 1}, 500);
          });
        });
      });
    });
});
}
$(window).on("hashchange", function(e) {
  // whenever the hash is changed,
  // the page content needs to change
  // in order to figure out how the page content needs to change,
  // we need to know what's in the hash
  var uncutUrl = window.location.hash.replace("#", "");
  if (uncutUrl == "") {uncutUrl = "index"};
  // we need to be able to iterate through
  // each part of the hash individually,
  // so we split it.
  // if there's only one page referenced in the hash,
  // the array will simply contain that item
  var urlArray = uncutUrl.split("/");
  // we now need to find the last reference in the hash
  // so that we can compare it to the page content:
  var url = urlArray.slice(-1)[0];
  // then we need to see where it exists on the page
  var exists = $("a[href='" + url + ".html']").parent()
  if (exists.index($("#up-arrow")) >= 0) {
    // if the url is attached to the up arrow,
    // we need to animate up the chart, so we call changeUp().
    changeUp(url);
  }
  else if (exists.length < 1) {
    // if there is no link to the last element in the hash,
    // that means it is further down the chart
    // which means for the animation to run properly,
    // we need to visit the pages in order
    $.each(urlArray, function(index, serialUrl) {
      //this timeout means each page waits the amount
      // of time it takes the previous page to load,
      // so the animation occurs sequentially through
      // the chart hierarchy.
      setTimeout(function() {
        changeDown(serialUrl);
      }, 3550 * index);
    });
  }
  else if (exists.first().hasClass("info")){
    // if the first example of the url is on an info div,
    // it is one step down the chart,
    // so it can simply run changeDown()
    changeDown(url);
  }
});

if (window.location.hash != "") {
  $(window).trigger("hashchange");
}



