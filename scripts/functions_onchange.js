/*! RESOURCE: /scripts/functions_onchange.js */
function onChange(elementName) {
  var eChanged = gel(elementName);
  var eOriginal = gel("sys_original." + elementName);
  var eDisplay = gel("sys_display." + elementName);
  if (eOriginal == null) {
    return;
  }
  var vOriginal = eOriginal.value;
  var vChanged = eChanged.value;
  var vDisplay = eDisplay ? eDisplay.value : null;
  eChanged.changed = (vOriginal != vChanged);
  if (!elementName.startsWith("IO:") && !elementName.startsWith("ni.VE")) {
    onChangeLabelProcess(elementName);
  }
  setMandatoryExplained();
  if (hasDepends != null && hasDepends(elementName))
    onSelChange(elementName);
  clientScriptOnChange(elementName, eChanged, vOriginal, vChanged);
  fieldChanged(elementName, eChanged.changed);
  var onChangeData = {
    id: elementName,
    value: vChanged,
    modified: eChanged.changed
  };
  if (vDisplay)
    onChangeData.displayValue = vDisplay;
  var parentForm = $(elementName).up('form');
  parentForm && parentForm.fire('glideform:onchange', onChangeData);
}

function onChangeLabelProcess(elementName, value) {
  var el = gel(elementName);
  var statusNode = gel('status.' + elementName);
  onChangeLabelProcessByEl(el, statusNode, value);
}

function onChangeLabelProcessByEl(elementNode, statusLabel, value) {
  if (!elementNode || !statusLabel)
    return;
  var mandatory = elementNode.getAttribute("mandatory") + "";
  var readonly = elementNode.disabled || hasClassName(elementNode, 'disabled');
  if (mandatory == null || mandatory == "null")
    mandatory = statusLabel.getAttribute("mandatory") + "";
  else
    statusLabel.setAttribute("mandatory", mandatory);
  var newClassName = statusLabel.getAttribute("oclass");
  var newFieldClassName = "";
  var newTitle = statusLabel.getAttribute("title");
  if (value == undefined)
    value = elementNode.value;
  if (mandatory == "true") {
    var currencySuffix = ";0.00";
    if (typeof value != 'undefined' && (value == "" || value.indexOf(currencySuffix, value.length - currencySuffix.length) != -1)) {
      newClassName = "mandatory";
      newFieldClassName = "is-required";
      newTitle = getMessage("Mandatory - must be populated before Submit");
    } else if (elementNode.changed) {
      newClassName = "changed";
      newFieldClassName = "is-filled";
      newTitle = getMessage("Field value has changed since last update");
    } else if (!readonly) {
      newClassName = "mandatory_populated";
      newFieldClassName = "is-prefilled";
      newTitle = getMessage("Mandatory - preloaded with saved data");
    } else {
      newClassName = "read_only";
      newTitle = getMessage("Read only - cannot be modified");
    }
  } else {
    if (elementNode.changed) {
      newClassName = "changed";
      newTitle = getMessage("Field value has changed since last update");
    } else if (readonly) {
      newClassName = "read_only";
      if (newTitle == "" || newTitle == null)
        newTitle = "Read only - cannot be modified";
    } else if (newClassName != "read_only" && newClassName != "changed") {
      newClassName = "";
      newTitle = "";
    }
  }
  var slm = gel("section508." + elementNode.id);
  if (slm) {
    slm.setAttribute("title", statusLabel.getAttribute("title"));
    slm.setAttribute("alt", statusLabel.getAttribute("title"));
  }
  newClassName += ' label_description';
  if (statusLabel.className == newClassName)
    return;
  var parentElement = gel("element." + elementNode.id);
  if (statusLabel.className.indexOf("required-marker") > -1)
    var previousMandatory = true;
  statusLabel.className = newClassName;
  if (previousMandatory && statusLabel.className.indexOf("required-marker") == -1 && parentElement && parentElement.className.indexOf("is-required") > -1)
    gel("element." + elementNode.id).className = parentElement.className.replace("is-required", "");
  statusLabel.setAttribute("title", newTitle);
  if (document.documentElement.getAttribute('data-doctype') == 'true') {
    if (mandatory == 'true') {
      statusLabel.className = "required-marker label_description";
    }
    if (newFieldClassName) {
      var formGroup = elementNode.up('.form-group');
      formGroup.removeClassName('is-prefilled');
      formGroup.removeClassName('is-required');
      formGroup.removeClassName('is-filled');
      formGroup.addClassName(newFieldClassName);
    }
    statusLabel.setAttribute('aria-label', newTitle);
  }
  CustomEvent.fire("mandatory.changed", elementNode.id, newClassName);
}

function clientScriptOnChange(elementName, eChanged, vOriginal, vChanged) {
  var splitMe = elementName.split('.');
  var tableName = splitMe[0];
  var fieldName = splitMe.slice(1).join('.');
  callChangeHandlers(tableName, fieldName, eChanged, vOriginal, vChanged);
}

function callChangeHandlers(tableName, fieldName, eChanged, vOriginal, vChanged) {
  var widgetName = tableName + "." + fieldName;
  if (typeof(g_form) != "undefined")
    g_form.hideFieldMsg(fieldName, true);
  template = false;
  if (eChanged.templateValue == 'true')
    template = true;
  eChanged.templateValue = 'false';
  for (var i = 0; i < g_event_handlers.length; i++) {
    var handler = g_event_handlers[i];
    if (handler.fieldName != widgetName && handler.fieldName != fieldName)
      continue;
    callChangeHandler(handler, this, eChanged, vOriginal, vChanged, false, template);
  }
  CustomEvent.fire("change.handlers.run", tableName, fieldName);
}

function fireAllChangeHandlers() {
  for (var x = 0; x < g_event_handlers.length; x++) {
    var handler = g_event_handlers[x];
    var elementName = handler.fieldName;
    var theWidget = gel(elementName);
    if (!theWidget)
      continue;
    var original = gel("sys_original." + elementName);
    var oldVal = 'unknown';
    if (original)
      oldVal = original.value;
    var newVal;
    if ($(theWidget).getAttribute("type") == "radio") {
      newVal = oldVal;
      var elems = $$('#' + $(theWidget).getAttribute("id")).each(function(el) {
        var checkedValue = el.getAttribute("checked");
        if (checkedValue != null && checkedValue.length > 0)
          newVal = el.value;
      });
    } else
      newVal = theWidget.value;
    callChangeHandler(handler, this, theWidget, oldVal, newVal, true, false);
  }
  CustomEvent.fire("change.handlers.run.all");
}

function callChangeHandler(handler, control, theWidget, oldVal, newVal, loading, template) {
  try {
    callChangeHandler0(handler, control, theWidget, oldVal, newVal, loading, template);
  } catch (ex) {
    if (g_user.hasRole('client_script_admin')) {
      g_form.showFieldMsg(theWidget, "onChange script error: " + ex.toString() + "\n" +
        handler.handler.toString(), "error", false);
    } else {
      g_form.showFieldMsg(theWidget,
        "Script error encountered when changing this field - please contact your System Administrator",
        "error", false);
    }
  }
}

function callChangeHandler0(handler, control, theWidget, oldVal, newVal, loading, template) {
  CustomEvent.fire('glide_optics_inspect_put_cs_context', handler.handlerName, 'change');
  var startTimer = new Date();
  handler.handler.call(control, theWidget, oldVal, newVal, loading, template);
  var n = g_event_handlers_onChange[handler.handlerName];
  if (n)
    CustomEvent.fire('page_timing', {
      name: 'CSOC',
      child: {
        description: n,
        sys_id: g_event_handler_ids[handler.handlerName],
        source_table: 'sys_script_client'
      },
      startTime: startTimer,
      win: window
    });
  CustomEvent.fire('glide_optics_inspect_pop_cs_context', handler.handlerName, 'change');
}

function multiKeyDown(me) {
  if ($(me.id).getAttribute("isquestionhtml") == "true")
    return;
  var eOriginal = 'g_' + me.id.replace(/\./g, '_');
  var eOriginalSet = eval("typeof " + eOriginal + " != 'undefined'");
  if (eOriginalSet)
    return;
  var oValue = escape(me.value);
  eval(eOriginal + '="' + oValue + '";');
  var form = findParentByTag(me, "form");
  if (me.id && form) {
    var elementName = me.id;
    if (gel("sys_original." + elementName)) {
      gel("sys_original." + elementName).value = "XXmultiChangeXX"
    } else {
      addInput(form, 'hidden', "sys_original." + elementName, "XXmultiChangeXX");
    }
  }
}

function multiModified(me, type, currentValue) {
  if ($(me.id).getAttribute("isquestionhtml") == "true") {
    $(me.id).onchange();
    return;
  }
  multiKeyDown(me);
  var form = findParentByTag(me, "form");
  var changeFlag = true;
  if (me.id && form) {
    var elementName = me.id;
    var vOriginal = unescape(eval('g_' + me.id.replace(/\./g, '_')));
    if (currentValue == undefined)
      currentValue = me.value;
    if (type == undefined)
      type = 'htmlarea';
    if (currentValue == vOriginal)
      changeFlag = false;
    me.changed = changeFlag;
    onChangeLabelProcess(elementName, currentValue);
    if (type == 'tinymce') {
      clientScriptOnChange(elementName, me, 'unknown', currentValue);
    } else {
      if ((typeof me.isFocused) == "boolean")
        if (me.isFocused == false)
          clientScriptOnChange(elementName, me, 'unknown', currentValue);
    }
  }
  fieldChanged(elementName, changeFlag);
  var onChangeData = {
    id: me.id,
    value: me.value,
    modified: me.changed
  };
  me.up('form').fire('glideform:onchange', onChangeData);
}

function formChangeKeepAlive() {
  var AJAX_KEEPALIVE_TIMEOUT = 900;
  var nowsecs = parseInt((new Date()).getTime() / 1000);
  var secs = parseInt(lastActivity.getTime() / 1000);
  var difference = nowsecs - secs;
  if (difference > AJAX_KEEPALIVE_TIMEOUT) {
    var aj = new GlideAjax("GlideSystemAjax");
    aj.addParam("sysparm_name", "isLoggedIn");
    aj.getXML(doNothing);
    lastActivity = new Date();
  }
}

function fieldChanged(elementName, changeFlag) {
  formChangeKeepAlive();
  if (typeof(g_form) != "undefined")
    g_form.fieldChanged(elementName, changeFlag);
}

function addOnChangeEvent(fields, tableName, callfunc) {
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    if (typeof field == "string") {
      if (tableName)
        field = tableName + "." + field;
      field = gel(field);
    }
    if (field && field.tagName)
      Event.observe(field, 'change', callfunc);
  }
}

function setColorSwatch(fieldName) {
  var colorValue = $(fieldName).value;
  var colorDisplay = $("color_swatch." + fieldName);
  try {
    colorDisplay.style.backgroundColor = colorValue;
  } catch (ex) {
    g_form.showErrorBox(fieldName, getMessage("Invalid color") + ":" + colorValue);
    $(fieldName).value = "";
    colorDisplay.style.backgroundColor = "";
  }
};