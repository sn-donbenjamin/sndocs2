/*! RESOURCE: /scripts/app.form_presence/app.form_presence.js */
angular.module('sn.form_presence', ['sn.base', 'sn.common.presence', 'sn.messaging', 'sn.i18n', 'sn.common.controls', 'sn.common.avatar', 'sn.common.ui.popover', 'sn.common.user_profile']).directive('formPresence',
  function(snRecordPresence, getTemplateUrl, $rootScope, $q) {
    "use strict";
    return {
      restrict: 'E',
      templateUrl: getTemplateUrl('ng_form_presence.xml'),
      controller: function($scope, $http, userData) {
        var viewingUsersCounter = 0;
        $scope.viewingUsers = [];
        snRecordPresence.initPresence(g_form.getTableName(), g_form.getUniqueValue());
        $rootScope.$on('sn.sessions', function(somescope, presence) {
          validateViewingUsers(presence);
        });

        function validateViewingUsers(sessions) {
          var raceCounter = ++viewingUsersCounter;
          var viewingUsers = [];
          var promises = [];
          angular.forEach(sessions, function(item) {
            var user = {
              avatar: item.user_avatar,
              initials: item.user_initials,
              userID: item.user_id,
              displayName: item.user_display_name,
              name: item.user_display_name,
              status: item.status
            };
            if (user.avatar && user.initials)
              viewingUsers.push(user);
            else {
              promises.push(userData.getUserById(user.userID).then(function(userInfo) {
                user.initials = userInfo.user_initials;
                user.avatar = userInfo.user_avatar;
                viewingUsers.push(user);
              }));
            }
          });
          $q.all(promises).then(function() {
            if (raceCounter == viewingUsersCounter)
              setViewingUsers(viewingUsers);
          });
        }

        function setViewingUsers(users) {
          $scope.viewingUsers = users;
          if ($scope.viewingUsers.length !== 0) {
            if (!$scope.$$phase)
              $rootScope.$apply();
            $rootScope.$emit('sn.presence', $scope.viewingUsers);
          }
        }
      },
      link: function($scope, $element) {
        $scope.$watch('viewingUsers.length', function(newValue, oldValue) {
          if (oldValue <= 1 && newValue > 1)
            $element.find('.sn-popover-presence').tooltip().popover();
        });
      }
    }
  }).run(function(snRecordWatcher, $rootScope, $http, userData) {
  "use strict";
  var previousMessages = {};
  var previousDecorations = {};
  if (typeof(g_form) != "undefined")
    snRecordWatcher.initRecord(g_form.getTableName(), g_form.getUniqueValue());
  $rootScope.$on('record.updated', function(someScope, data) {
    var modifiedFields = g_form.modifiedFields;
    angular.forEach(data.changes, function(field) {
      if (isConcurrentModification(data, field, modifiedFields)) {
        if (!g_form.submitted)
          showConcurrentFieldMsg(data, field);
      } else {
        var uiEl = g_form.getGlideUIElement(field);
        if (!uiEl)
          return;
        if (uiEl.getType() == 'journal_input')
          return;
        if (!g_form.submitted && !g_submitted) {
          showFieldUpdatedDecoration(data, field);
        }
      }
    });
  });

  function isConcurrentModification(data, field, modifiedFields) {
    return modifiedFields[g_form.getTableName() + '.' + field] &&
      g_user.getUserName() != data.record.sys_updated_by.value;
  }

  function showConcurrentFieldMsg(data, field) {
    if (!(field in data.record))
      return;
    getUserDisplayName(data.record.sys_updated_by.display_value, function(display_name) {
      var displayValue = data.record[field].display_value;
      var message = display_name + ' has set this field to ' + displayValue;
      if (!displayValue)
        message = display_name + ' has cleared the value of this field';
      if (previousMessages[field])
        g_form.hideFieldMsg(field);
      previousMessages[field] = message;
      g_form.showFieldMsg(field, message, 'error');
    })
  }

  function showFieldUpdatedDecoration(data, field) {
    if (typeof data.record[field] !== 'undefined')
      g_form.setValue(field, data.record[field].value, data.record[field].display_value);
    getUserDisplayName(data.record.sys_updated_by.display_value, function(display_name) {
      var message = display_name + ' has modified this field value';
      if (previousDecorations[field])
        g_form.removeDecoration(field, 'icon-activity-circle', previousDecorations[field], 'color-accent');
      previousDecorations[field] = message;
      g_form.addDecoration(field, 'icon-activity-circle', message, 'color-accent');
    });
  }

  function getUserDisplayName(user_name, callback) {
    userData.getUserByName(user_name).then(function(userInfo) {
      var result = user_name;
      if (userInfo && userInfo.user_name == user_name)
        result = userInfo.user_display_name;
      callback.call(null, result);
    });
  }
});;