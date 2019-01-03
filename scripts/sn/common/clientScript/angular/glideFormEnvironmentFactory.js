/*! RESOURCE: /scripts/sn/common/clientScript/angular/glideFormEnvironmentFactory.js */
angular.module('sn.common.clientScript').factory('glideFormEnvironmentFactory', function(
  $q,
  $window,
  $timeout,
  glideFormFieldFactory,
  glideAjaxFactory,
  glideRecordFactory,
  i18n,
  glideModalFactory,
  jQueryRequestShim
) {
  'use strict';
  var factory = $window.glideFormEnvironmentFactory;
  angular.extend(factory.defaultExtensionPoints, {
    GlideAjax: glideAjaxFactory.getClass(),
    GlideRecord: glideRecordFactory.getClass(),
    getMessage: i18n.getMessage,
    getMessages: i18n.getMessages,
    $: jQueryRequestShim
  });
  factory.createInitializer = function(g_form, g_user, g_scratchpad, clientScripts, uiPolicies, g_modal) {
    if (typeof g_modal === 'undefined') {
      g_modal = glideModalFactory.create();
    }
    var g_env = glideFormEnvironmentFactory.create(g_form, g_scratchpad, g_user, g_modal);
    if (clientScripts && clientScripts.messages) {
      for (var key in clientScripts.messages) {
        i18n.loadMessage(key, clientScripts.messages[key]);
      }
    }
    return function() {
      g_env.initScripts(clientScripts);
      if (uiPolicies && (uiPolicies.length > 0)) {
        g_env.initUIPolicyScripts(uiPolicies);
      }
      return g_env;
    };
  };
  factory.createWithConfiguration = function(g_form, g_user, g_scratchpad, clientScripts, uiPolicies, g_modal) {
    if (typeof g_modal === 'undefined') {
      g_modal = glideModalFactory.create();
    }
    var g_env = glideFormEnvironmentFactory.create(g_form, g_scratchpad, g_user, g_modal);
    if (clientScripts && clientScripts.messages) {
      for (var key in clientScripts.messages) {
        i18n.loadMessage(key, clientScripts.messages[key]);
      }
    }
    return {
      g_env: g_env,
      initialize: function() {
        g_env.initScripts(clientScripts);
        if (uiPolicies && (uiPolicies.length > 0)) {
          g_env.initUIPolicyScripts(uiPolicies);
        }
      }
    };
  };
  var FIELDS_INITIALIZED_INTERVAL = 195;
  factory.onFieldsInitialized = function(fields) {
    var $fieldsReady = $q.defer();
    var $readyTimeout = $timeout(checkFormFields, FIELDS_INITIALIZED_INTERVAL);

    function checkFormFields() {
      var ready = fields.reduce(function(previous, field) {
        return previous && glideFormFieldFactory.isInitialized(field);
      }, true);
      if (!ready) {
        $readyTimeout = $timeout(checkFormFields, FIELDS_INITIALIZED_INTERVAL);
        return;
      }
      $fieldsReady.resolve();
    }
    return $fieldsReady.promise;
  };
  return factory;
});;