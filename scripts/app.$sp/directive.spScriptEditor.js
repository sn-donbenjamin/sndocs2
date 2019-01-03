/*! RESOURCE: /scripts/app.$sp/directive.spScriptEditor.js */
angular.module('sn.$sp').directive('spScriptEditor', function($rootScope, $timeout, $http, spCodeEditorAutocomplete, defaultJSAutocomplete) {
  return {
    template: '<textarea class="CodeMirror" name="{{::field.name}}" ng-model="v" style="width: 100%;" data-length="{{::dataLength}}" data-charlimit="false">' +
      '</textarea>',
    restrict: 'E',
    require: '^ngModel',
    replace: true,
    scope: {
      field: '=',
      dataLength: '@',
      options: '@?',
      snDisabled: '=?',
      snChange: '&',
      snBlur: '&'
    },
    link: function(scope, element, attrs, ctrl) {
      element[0].value = scope.field.value;
      element[0].id = scope.field.name + "_javascript_editor";
      var cmi = initializeCodeMirror(element[0]);
      var server;
      spCodeEditorAutocomplete.getConfig('sp_widget', scope.field.name)
        .then(setupTernServer);
      scope.$watch(function() {
        return scope.field.value;
      }, function(newValue, oldValue) {
        if (newValue != oldValue && !cmi.hasFocus())
          cmi.getDoc().setValue(scope.field.value);
      });
      ctrl.$viewChangeListeners.push(function() {
        scope.$eval(attrs.ngChange);
      });
      cmi.on('change', function(cm) {
        if ("stagedValue" in scope.field) {
          scope.field.stagedValue = cm.getValue();
          ctrl.$setViewValue(scope.field.stagedValue);
        } else {
          scope.field.value = cm.getValue();
          ctrl.$setViewValue(scope.field.value);
        }
        if (angular.isDefined(scope.snChange))
          scope.snChange();
      });
      cmi.on('blur', function(cm) {
        if ("stagedValue" in scope.field) {
          scope.field.stagedValue = cm.getValue();
          ctrl.$setViewValue(scope.field.stagedValue);
        } else {
          scope.field.value = cm.getValue();
          ctrl.$setViewValue(scope.field.value);
        }
        if (angular.isDefined(scope.snBlur))
          scope.snBlur();
      });
      scope.$watch('snDisabled', function(newValue) {
        if (angular.isDefined(newValue)) {
          cmi.setOption('readOnly', newValue);
        }
      });
      cmi.on("keyup", function(cm, event) {
        var keyCode = ('which' in event) ? event.which : event.keyCode;
        var ternTooltip = document.getElementsByClassName('CodeMirror-Tern-tooltip')[0];
        if (keyCode == 190)
          if (event.shiftKey)
            return;
          else
            server.complete(cmi, server);
        if (keyCode == 57 && window.event.shiftKey && ternTooltip)
          angular.element(ternTooltip).show();
        if (keyCode == 27 && ternTooltip) {
          angular.element(ternTooltip).hide();
        }
      });
      cmi.on("startCompletion", function(cm) {
        var completion = cm.state.completionActive;
        completion.options.completeSingle = false;
        var pick = completion.pick;
        completion.pick = function(data, i) {
          var completion = data.list[i];
          CodeMirror.signal(cm, "codemirror_hint_pick", {
            data: completion,
            editor: cm
          });
          pick.apply(this, arguments);
        }
      });
      cmi.on("codemirror_hint_pick", function(i) {
        var data = i.data.data;
        var editor = i.editor;
        var cur = editor.getCursor();
        var token = data.type;
        if (token && token.indexOf('fn(') != -1) {
          if (editor.getTokenAt({
              ch: cur.ch + 1,
              line: cur.line
            }).string != '(') {
            editor.replaceRange('()', {
              line: cur.line,
              ch: cur.ch
            }, {
              line: cur.line,
              ch: cur.ch
            });
            if (token && token.substr(0, 4) !== 'fn()' && angular.element('div.CodeMirror-Tern-tooltip')[0]) {
              editor.execCommand('goCharLeft');
              setTimeout(function() {
                var ternTooltip = document.getElementsByClassName('CodeMirror-Tern-tooltip')[0];
                if (ternTooltip) {
                  angular.element(ternTooltip).show();
                }
              }, 100)
            }
          } else if (token && token.substr(0, 4) !== 'fn()')
            editor.execCommand('goCharRight');
        }
      });

      function initializeCodeMirror(elem) {
        var options = {
          mode: "javascript",
          lineNumbers: true,
          lineWrapping: false,
          readOnly: scope.snDisabled === true,
          viewportMargin: Infinity,
          gutters: ["CodeMirror-lint-markers"],
          lint: {
            asi: true
          },
          indentWithTabs: true,
          tabSize: 2,
          matchBrackets: true,
          autoCloseBrackets: true,
          theme: "snc"
        };
        if (scope.options) {
          Object.keys(scope.options).forEach(function(key) {
            options[key] = scope.options[key];
          });
        }
        return CodeMirror.fromTextArea(elem, options);
      }

      function setupTernServer(data) {
        var plugins = {};
        if (scope.field.name === "client_script")
          plugins = {
            "angular": "./"
          };
        server = new CodeMirror.TernServer({
          defs: [data, defaultJSAutocomplete],
          plugins: plugins
        });
        cmi.setOption("extraKeys", {
          "Ctrl-Space": function(cm) {
            server.complete(cm);
          },
          "Ctrl-I": function(cm) {
            server.showType(cm);
          },
          "Ctrl-O": function(cm) {
            server.showDocs(cm);
          },
          "Alt-.": function(cm) {
            server.jumpToDef(cm);
          },
          "Alt-,": function(cm) {
            server.jumpBack(cm);
          },
          "Ctrl-Q": function(cm) {
            server.rename(cm);
          },
          "Ctrl-.": function(cm) {
            server.selectName(cm);
          }
        });
        cmi.on("cursorActivity", function(cm) {
          server.updateArgHints(cm);
        });
      }
    }
  }
});