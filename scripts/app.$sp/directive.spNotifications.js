/*! RESOURCE: /scripts/app.$sp/directive.spNotifications.js */
angular.module('sn.$sp').directive('spNotifications', function($timeout) {
  var str = 'CONSOLE:';

  function isConsoleMsg(msg) {
    return msg.startsWith(str);
  }

  function outputToConsole(msg) {
    var output = msg.substring(str.length);
    var reg = new RegExp("^\\{|^\\[");
    if (reg.test(output)) {
      try {
        output = jQuery.parseJSON(output);
      } catch (err) {}
    }
    console.warn(output);
  }
  return {
    restrict: 'E',
    replace: true,
    template: '<div id="uiNotificationContainer">\
<div ng-repeat="m in c.notifications track by $index"\
class="alert" ng-class="m.type == \'error\' ? \'alert-danger\' : \'alert-success\'">\
<span ng-bind-html="::m.message"></span>\
<a ng-if="::$first" class="fa fa-close dismiss-notifications" ng-click="::c.dismissNotifications()"></a>\
</div>\
</div>',
    controllerAs: 'c',
    controller: function($scope) {
      var c = this;
      c.notifications = [];
      var timer;

      function addNotification(notification) {
        if (isConsoleMsg(notification.message)) {
          outputToConsole(notification.message);
        } else {
          c.notifications.push(notification);
          timer = autoDismiss();
        }
      }

      function addNotifications(e, notifications) {
        if (Array.isArray(notifications)) {
          for (var x in notifications)
            addNotification(notifications[x]);
        } else {
          addNotification(notifications);
        }
      }
      $scope.$on("$$uiNotification", addNotifications);
      c.dismissNotifications = function() {
        c.notifications.length = 0;
      };
      c.getMilliSeconds = function() {
        var seconds = (areTrivial(c.notifications)) ? 3 : 5;
        return seconds * 1000;
      };

      function areTrivial(input) {
        return input.length >= 1 && input.every(function(item) {
          return item && item.type === 'trivial';
        })
      }

      function autoDismiss() {
        if (timer)
          $timeout.cancel(timer);
        return $timeout(c.dismissNotifications, c.getMilliSeconds());
      }
      c.cancelAutoDismiss = function() {
        if (areTrivial(c.notifications))
          return;
        $timeout.cancel(timer);
      };
      $scope.$on("$$uiNotification.dismiss", c.dismissNotifications);
    },
    link: function(scope, element, attrs, ctrl) {
      var $el = $(element);
      $el.on('mouseover', function() {
        $el.off();
        ctrl.cancelAutoDismiss();
      });
    }
  }
});;