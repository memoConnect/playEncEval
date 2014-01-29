'use strict';
define(['app'], function (app) {
  // Losely based on code from https://github.com/densitydesign/raw/blob/master/js/directives.js
  app.register.factory('svgDownload', function() {
    return function(el) {
        console.log(el)
      var elm = angular.element(el);
        console.log(elm)
//      elm.find('svg')
//        .attr("version", 1.1)
//        .attr("xmlns", "http://www.w3.org/2000/svg");
//
//      var html = elm.html();
//      var blob = new Blob([html], { type: "data:image/svg+xml" });
      return {
        getHtml: function() { return html; },
        getBlob: function() { return blob; },
        asSvg: function(filename) { saveAs(blob, filename) }
      }
    }

  });

  app.register.directive('svgDownload', ['svgDownload', function (svgDownload) {
    return {
      restrict: 'A',
      scope : {
        source : '@svgDownload'
      },
      link: function (scope, element, attrs) {
        element.bind('click', function(event) {
          scope.$apply(function() {
            //download();
              alert("Na wirklich sicher?")
          });
        });
        function download(){
          var filename = encodeURI(attrs.filename) || (encodeURI(attrs.title) || 'untitled') + ".svg";
            console.log(filename)
          if(!scope.source) return;
            console.log(scope)
            console.log("huhu"+scope.source)
          svgDownload(scope.source).asSvg(filename);
        }
      }
    };
  }]);
});