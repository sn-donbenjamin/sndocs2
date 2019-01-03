/*! RESOURCE: /scripts/sn/common/ui/directive.snModal.js */
angular.module("sn.common.ui").directive("snModal", function($timeout, $rootScope) {
  "use strict";
  return {
    restrict: "AE",
    transclude: true,
    scope: {},
    replace: true,
    template: '<div tabindex="-1" aria-hidden="true" class="modal" role="dialog"></div>',
    link: function(scope, element, attrs, ctrl, transcludeFn) {
      var transcludeScope = {};
      transcludeFn(element.scope().$new(), function(a, b) {
        element.append(a);
        transcludeScope = b;
      });
      scope.$on("dialog." + attrs.name + ".show", function(event, data) {
        if (!isOpen())
          show(data);
      });
      scope.$on("dialog." + attrs.name + ".close", function() {
        if (isOpen())
          close();
      });

      function eventFn(eventName) {
        return function(e) {
          $rootScope.$broadcast("dialog." + attrs.name + "." + eventName, e);
        }
      }
      var events = {
        'shown.bs.modal': eventFn("opened"),
        'hide.bs.modal': eventFn("hide"),
        'hidden.bs.modal': eventFn("closed")
      };

      function show(data) {
        var context = attrs.context;
        var contextData = null;
        if (context && data && context in data) {
          contextData = data[context];
          transcludeScope[context] = contextData;
        }
        $timeout(function() {
          angular.element('.sn-popover-basic').each(function() {
            var $this = angular.element(this);
            if (angular.element($this.attr('data-target')).is(':visible')) {
              $this.popover('hide');
            }
          });
        });
        element.modal('show');
        for (var event in events)
          if (events.hasOwnProperty(event))
            element.on(event, events[event]);
      }

      function close() {
        element.modal('hide');
        for (var event in events)
          if (events.hasOwnProperty(event))
            element.off(event, events[event]);
      }

      function isOpen() {
        return element.hasClass('in');
      }
    }
  }
});;