(function(root, factory) {
  if(typeof define === 'function' && define.amd) {
    define(['angular', 'image-picker-component'], factory);
  } else if(typeof exports === 'object') {
    module.exports = factory(require('angular'), require('image-picker-component'));
  } else {
    factory(root.angular, root.ImagePickerComponent);
  }
})(this, function(angular, ImagePickerComponent) {
  return angular
    .module('image-picker-component', [])
    .directive('imgPicker', ['uploader', function(uploader) {
      ImagePickerComponent.register('image-picker', uploader);

      return {
        restrict: 'E',
        scope: {
          ngModel: '='
        },
        link(scope, element, attrs) {
          var im = document.createElement('image-picker');

          im.setController(uploader(scope.ngModel));
          scope.ngModel = im.$controller;

          for(let key of ["width", "height", "name", "format", "mode"]) {
            if(attrs.hasOwnProperty(key)) {
              attrs.$observe(key, function(val) {
                  im.setAttribute(key, attrs[key]);
              });
            }
          }

          scope.$watch(() => scope.ngModel !== im.$controller, function() {
            if(scope.ngModel !== im.$controller) {
              im.setController(uploader(scope.ngModel));
              scope.ngModel = im.$controller;
            }
          });

          element[0].appendChild(im);
        }
      };
    }])
    .name;
});