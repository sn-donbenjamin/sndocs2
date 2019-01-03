/*! RESOURCE: /scripts/snm/cabrillo/form.js */
(function(window, cabrillo, undefined) {
  'use strict';
  var PACKAGE = 'form';
  cabrillo.extend(cabrillo, {
    form: {
      didChangeRecord: didChangeRecord
    }
  });

  function didChangeRecord(isNewRecord, tableName, sysId) {
    if (isNewRecord) {
      didCreateRecord(tableName, sysId);
    } else {
      didUpdateRecord(tableName, sysId);
    }
  }

  function didCreateRecord(tableName, sysId) {
    callMethod('didCreateRecord', {
      table: tableName,
      sysId: sysId
    });
  }

  function didUpdateRecord(tableName, sysId) {
    callMethod('didUpdateRecord', {
      table: tableName,
      sysId: sysId
    });
  }

  function callMethod(methodName, data) {
    return cabrillo.callMethod(cabrillo.PACKAGE + '.' + PACKAGE + '.' + methodName, data);
  }
})(window, window['snmCabrillo']);;