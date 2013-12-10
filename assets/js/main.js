$("#mouffe").on("click", function(e){
  var video = $("#mouffe")[0];
  if (video.paused) {
    $("#mouffe").css({"width": "70%"});
    video.play();
  }
  else {
    video.pause();
    $("#mouffe").css({"width": ""});
  }
} );

$("#github").on("click", function(e) {
  e.preventDefault();
  debugger;
  $this = $(this);
  $("#" + $this.attr("id") + " .throbber").css("display", "inline");
  $("#" + $this.attr("id") + " .text").css("display", "none");
  $.ajax({
    type: "get",
    url: "https://api.github.com/users/eriese/repos"
  }).done(function(response) {
    data = JSON.parse(response);
    alert(data[0]);
    $("#" + $this.attr("id") + " .throbber").css("display", "none");
    $("#" + $this.attr("id") + " .text").css("display", "inline");
  })
})


setSize = function() {
  var size = $(window).width() * 0.15
  $(".info").css("width", size);
  $(".info").css("height", size);
  $(".magenta").css("padding-top", size / 2 - 8);
  var margin = $(".info").css("margin");
  var marginNum = margin.replace("px", "");
  $(".bottom").width(size + parseInt(marginNum) * 2);
}

setSize();
$(window).resize(setSize);
// $(function() {
//   var handler = $('#container li');
//   handler.wookmark({
//     autoResize: true,
//     container: $('#container'),
//     align: "center"
//   });
// });


// $("#container li").workmark({
//   autoResize: true,
//   container: $container,
//   align: "center",
//   itemWidth: "200"
// });
// $container.isotope({
//   itemSelector : '.item',
//   masonry: {
//   }
// });

// $container.toggleClass('variable-sizes')
// $container.isotope('reLayout');
// $.Isotope.prototype._getCenteredMasonryColumns = function() {
//     this.width = this.element.width();

//     var parentWidth = this.element.parent().width();

//                   // i.e. options.masonry && options.masonry.columnWidth
//     var colW = this.options.masonry && this.options.masonry.columnWidth ||
//                   // or use the size of the first item
//                   this.$filteredAtoms.outerWidth(true) ||
//                   // if there's no items, use size of container
//                   parentWidth;

//     var cols = Math.floor( parentWidth / colW );
//     cols = Math.max( cols, 1 );

//     // i.e. this.masonry.cols = ....
//     this.masonry.cols = cols;
//     // i.e. this.masonry.columnWidth = ...
//     this.masonry.columnWidth = colW;
//   };

//   $.Isotope.prototype._masonryReset = function() {
//     // layout-specific props
//     this.masonry = {};
//     // FIXME shouldn't have to call this again
//     this._getCenteredMasonryColumns();
//     var i = this.masonry.cols;
//     this.masonry.colYs = [];
//     while (i--) {
//       this.masonry.colYs.push( 0 );
//     }
//   };

//   $.Isotope.prototype._masonryResizeChanged = function() {
//     var prevColCount = this.masonry.cols;
//     // get updated colCount
//     this._getCenteredMasonryColumns();
//     return ( this.masonry.cols !== prevColCount );
//   };

//   $.Isotope.prototype._masonryGetContainerSize = function() {
//     var unusedCols = 0,
//         i = this.masonry.cols;
//     // count unused columns
//     while ( --i ) {
//       if ( this.masonry.colYs[i] !== 0 ) {
//         break;
//       }
//       unusedCols++;
//     }

//     return {
//           height : Math.max.apply( Math, this.masonry.colYs ),
//           // fit container to columns that have been used;
//           width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
//         };
//   };
