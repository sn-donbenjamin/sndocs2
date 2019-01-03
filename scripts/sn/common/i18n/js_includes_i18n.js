/*! RESOURCE: /scripts/sn/common/i18n/js_includes_i18n.js */
/*! RESOURCE: /scripts/sn/common/i18n/_module.js */
angular.module('sn.common.i18n', ['sn.common.glide']);
angular.module('sn.i18n', ['sn.common.i18n']);;
/*! RESOURCE: /scripts/sn/common/i18n/directive.snBindI18n.js */
angular.module('sn.common.i18n').directive('snBindI18n', function(i18n, $sanitize) {
  return {
    restrict: 'A',
    link: function(scope, iElem, iAttrs) {
      i18n.getMessage(iAttrs.snBindI18n, function(translatedValue) {
        var sanitizedValue = $sanitize(translatedValue);
        iElem.append(sanitizedValue);
      });
    }
  }
});;
/*! RESOURCE: /scripts/sn/common/i18n/directive.message.js */
angular.module('sn.common.i18n').directive('nowMessage', function(i18n) {
  return {
    restrict: 'E',
    priority: 0,
    template: '',
    replace: true,
    compile: function(element, attrs, transclude) {
      var value = element.attr('value');
      if (!attrs.key || !value)
        return;
      i18n.loadMessage(attrs.key, value);
    }
  };
});;
/*! RESOURCE: /scripts/sn/common/i18n/service.i18n.js */
angular.module('sn.common.i18n').factory('i18n', function(nowServer, $http, $window, $log) {
  var messageMap = {};
  var isDebug = $window.NOW ? $window.NOW.i18n_debug : true;

  function getMessageFromServer(msgKey, callback) {
    getMessagesFromServer([msgKey], function() {
      if (callback)
        callback(messageMap[msgKey]);
    });
  }

  function getMessagesFromServer(msgArray, callback, msgArrayFull) {
    var url = nowServer.getURL('message');
    $http.post(url, {
      messages: msgArray
    }).success(function(response) {
      var messages = response.messages;
      for (var i in messages) {
        loadMessage(i, messages[i]);
      }
      var returnMessages = {},
        allMessages = msgArrayFull || msgArray;
      for (var j = 0; j < allMessages.length; j++) {
        var key = allMessages[j];
        returnMessages[key] = messageMap[key];
      }
      if (callback)
        callback(returnMessages);
    });
  }

  function loadMessage(msgKey, msgValue) {
    messageMap[msgKey] = msgValue;
  }

  function debug(msg) {
    if (!isDebug)
      return;
    $log.log('i18n: ' + msg);
  }

  function interpolate(param) {
    return this.replace(/{([^{}]*)}/g,
      function(a, b) {
        var r = param[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  }
  if (!String.prototype.withValues)
    String.prototype.withValues = interpolate;
  return {
    getMessage: function(msgKey, callback) {
      debug('getMessage: Checking for ' + msgKey);
      if (messageMap.hasOwnProperty(msgKey)) {
        var message = messageMap[msgKey];
        if (typeof(callback) == 'function')
          callback(message);
        debug('getMessage: Found: ' + msgKey + ', message: ' + message);
        return message;
      }
      debug('getMessage: Not found: ' + msgKey + ', querying server');
      getMessageFromServer(msgKey, callback);
      msgKey.withValues = interpolate;
      if (typeof(callback) != 'function')
        $log.warn('getMessage (key="' + msgKey + '"): synchronous use not supported in Mobile or Service Portal unless message is already cached');
      return msgKey;
    },
    format: function(message) {
      if (arguments.length == 1)
        return message;
      if (arguments.length == 2 && (typeof arguments[1] === 'object'))
        return interpolate.call(message, arguments[1]);
      return interpolate.call(message, [].slice.call(arguments, 1));
    },
    getMessages: function(msgArray, callback) {
      debug('getMessages: Checking for ' + msgArray.join(','));
      var results = {},
        needMessage = [],
        needServerRequest = false;
      for (var i = 0; i < msgArray.length; i++) {
        var key = msgArray[i];
        if (!messageMap.hasOwnProperty(key)) {
          debug('getMessages: Did not find ' + key);
          needMessage.push(key);
          needServerRequest = true;
          results[key] = key;
          continue;
        }
        results[key] = messageMap[key];
        debug('getMessages: Found ' + key + ', message: ' + results[key]);
      }
      if (needServerRequest) {
        debug('getMessages: Querying server for ' + needMessage.join(','));
        getMessagesFromServer(needMessage, callback, msgArray);
      } else if (typeof(callback) == 'function') {
        debug('getMessages: Found all messages');
        callback(results);
      }
      return results;
    },
    clearMessages: function() {
      debug('clearMessages: clearing messages');
      messageMap = {};
    },
    loadMessage: function(msgKey, msgValue) {
      loadMessage(msgKey, msgValue);
      debug('loadMessage: loaded key: ' + msgKey + ', value: ' + msgValue);
    },
    preloadMessages: function() {
      var that = this
      angular.element('now-message').each(function() {
        var elem = angular.element(this);
        that.loadMessage(elem.attr('key'), elem.attr('value'));
      })
    }
  };
});;;