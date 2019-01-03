function addAttachmentNameToForm(sysid, name, hoverText, image, showRename, showView, showPopup) {
  var modified = $("attachments_modified");
  if (modified)
    modified.value = "true";
  showObjectInline($("header_attachment_list_label"));
  var line = $("header_attachment_line");
  if (line)
    line.setStyle({
      visibility: 'visible',
      display: ''
    });
  var span = $(cel('span'));
  span.id = "attachment_" + sysid;
  span.style.marginRight = "10px";
  span.innerHTML = '<a href="sys_attachment.do?sys_id=' + sysid + '" title="' + hoverText + '" style="margin-right:4px;"><img src="' + image + '" alt="" /></a>';
  var txt = $(cel('a'));
  txt.innerHTML = name;
  txt.href = '#';
  txt.onkeydown = function(event) {
    return allowInPlaceEditModification(txt, event);
  };
  txt.href = 'sys_attachment.do?sys_id=' + sysid;
  txt.setAttribute('data-id', sysid);
  txt.style.display = 'inline';
  txt.inPlaceEdit({
    selectOnStart: true,
    turnClickEditingOff: true,
    onAfterEdit: function(newName) {
      var oldName = this.oldValue;
      var ga = new GlideAjax('AttachmentAjax');
      ga.addParam('sysparm_type', 'initialRename');
      ga.addParam('sysparm_value', sysid);
      ga.addParam('sysparm_name', newName);
      ga.getXML(function(response) {
        var answer = response.responseXML.documentElement.getAttribute("answer");
        if (answer !== '0')
          alert(new GwtMessage().getMessage("Renaming attachment {0} to new name {1} is not allowed", oldName, newName));
        $$('a[data-id="' + sysid + '"]').each(function(elem) {
          elem.innerHTML = (answer === '0') ? newName : oldName;
        });
      });
    }
  });
  txt.style.marginRight = "5px";
  span.appendChild(txt);
  if (showRename == 'true') {
    var renameAttachment = $(cel('a'));
    renameAttachment.className = 'attachment';
    renameAttachment.onclick = function() {
      txt.beginEdit();
    };
    renameAttachment.innerHTML = getMessage('[rename]');
    span.appendChild(renameAttachment);
  }
  if (showView == "true") {
    var blank = document.createTextNode(" ");
    span.appendChild(blank);
    var view = cel("a");
    var newText = document.createTextNode(getMessage('[view]'));
    view.appendChild(newText);
    view.className = "attachment";
    if (showPopup == "false")
      view.href = "sys_attachment.do?sys_id=" + sysid + "&view=true";
    else
      view.onclick = function() {
        tearOffAttachment(sysid)
      };
    span.appendChild(view);
    span.appendChild(blank);
  }
  var storage = cel('li');
  storage.appendChild(span);
  var attachList = $("header_attachment_list");
  if (attachList)
    attachList.appendChild(storage);
  var header_attachment = $('header_attachment');
  if (header_attachment) {
    header_attachment.style.height = '1.4em';
    _frameChanged();
  }
  var ga = new GlideAjax('AttachmentAjax');
  ga.addParam('sysparm_type', 'attachmentParentSysId');
  ga.addParam('sysparm_value', sysid);
  ga.getXMLAnswer(changeCount, null, 'increase');
  var more_attachments = $('more_attachments');
  if (header_attachment && more_attachments)
    if ((computeAttachmentWidth() - 20) >= (header_attachment.getWidth() - more_attachments.getWidth()))
      more_attachments.style.display = 'block';
    else
      more_attachments.style.display = 'none';
}

function addEllipsesToAttachments() {
  var list = $('header_attachment_list');
  if (!list)
    return;
  var att = $('header_attachment');
  if (!att)
    return;
  var li = list.select('li');
  var totalWidth = 0;
  for (var i = 0; i < li.length; i++)
    totalWidth += li[i].getWidth();
  var more = $('more_attachments');
  if ((totalWidth - 20) >= ($('header_attachment').getWidth() - more.getWidth()))
    more.style.display = 'block';
  else
    more.style.display = 'none';
}

function addAttachmentNameToDialog(id, fileName, canDelete, createdBy, createdOn, contentType, iconPath) {
  if ($('attachment') == null)
    return;
  var encryptCheck = gel("encrypt_checkbox");
  if (encryptCheck) {
    encryptCheck.checked = false;
    $('sysparm_encryption_context').value = "";
  }
  gel("please_wait").style.display = "none";
  if (typeof id == "undefined")
    return;
  var noAttachments = gel("no_attachments");
  if (noAttachments.style.display == "block")
    noAttachments.style.display = "none";
  var table = gel("attachment_table_body");
  var tr = cel("tr");
  var td = cel("td");
  td.style.whiteSpace = "nowrap";
  td.colspan = "2";
  if (canDelete) {
    var input = cel("input");
    var checkId = "sys_id_" + id;
    input.name = checkId;
    input.id = checkId;
    input.type = "checkbox";
    input.onclick = function() {
      setRemoveButton(gel(checkId));
    };
    td.appendChild(input);
    gel("delete_button_span").style.display = "inline";
    var text = document.createTextNode(" ");
    td.appendChild(text);
    input = cel("input");
    input.type = "hidden";
    input.name = "Name";
    input.value = "false";
    td.appendChild(input);
  }
  var anchor = cel("a");
  anchor.style.marginRight = "4px";
  anchor.href = "sys_attachment.do?sys_id=" + id;
  anchor.title = " " + createdBy + "  " + createdOn;
  var imgSrc = iconPath;
  var img = cel("img");
  img.src = imgSrc;
  img.alt = anchor.title;
  anchor.appendChild(img);
  var text = $(cel('a'));
  text.style.display = "inline";
  text.href = '#';
  text.href = "sys_attachment.do?sys_id=" + id;
  text.onkeydown = function(event) {
    return allowInPlaceEditModification(text, event);
  };
  text.style.marginRight = "5px";
  text.innerHTML = fileName;
  text.setAttribute("data-id", id);
  text.inPlaceEdit({
    selectOnStart: true,
    turnClickEditingOff: true,
    onAfterEdit: function(newName) {
      var ga = new GlideAjax('AttachmentAjax');
      ga.addParam('sysparm_type', 'rename');
      ga.addParam('sysparm_value', id);
      ga.addParam('sysparm_name', newName);
      ga.getXML();
      $$('a[data-id="' + id + '"]').each(function(elem) {
        elem.innerHTML = newName;
      });
      $$('span[data-id="' + id + '"]').each(function(el) {
        el.innerHTML = newName;
      });
    }
  });
  if (contentType == "text/html")
    anchor.target = "_blank";
  td.appendChild(anchor);
  td.appendChild(text);
  if ($('ni.show_rename_link').value) {
    var renameAttachment = $(cel('a'));
    renameAttachment.className = 'attachment';
    renameAttachment.onclick = function() {
      text.beginEdit();
    };
    renameAttachment.innerHTML = getMessage('[rename]');
    td.appendChild(renameAttachment);
  }
  var showView = gel("ni.show_attachment_view").value;
  if (showView == "true") {
    var blank = document.createTextNode(" ");
    tr.appendChild(blank);
    var view = cel("a");
    var newText = document.createTextNode(getMessage("[view]"));
    view.appendChild(newText);
    view.className = "attachment";
    if (showPopup == "false")
      view.href = "sys_attachment.do?sys_id=" + id + "&view=true";
    else
      view.onclick = function() {
        tearOffAttachment(id)
      };
    td.appendChild(blank);
    td.appendChild(view);
  }
  var showPopup = gel("ni.show_attachment_popup").value;
  tr.appendChild(td);
  table.appendChild(tr);
  var alert508 = "$[GlideAccessibility.isEnabled()]";
  if (alert508 == 'true')
    alert(fileName + " " + anchor.title);
}

function computeAttachmentWidth() {
  var temp = $('header_attachment_list').select('li');
  var totalWidth = 0;
  for (var i = 0; i < temp.length; i++) {
    totalWidth += temp[i].getWidth();
  }
  return totalWidth;
}

function updateAttachmentCount(sysid) {
  var ga = new GlideAjax('AttachmentAjax');
  ga.addParam('sysparm_type', 'attachmentCount');
  ga.addParam('sysparm_value', sysid);
  ga.getXMLAnswer(numberOfAttachments, null, sysid);
}

function numberOfAttachments(answer, sysid) {
  var number = parseInt(answer);
  var buttons = $$('.attachmentNumber_' + sysid);
  if (buttons[0] == undefined)
    $('header_attachment_list_label').down().innerHTML = number;
  else {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].innerHTML = number;
    }
  }
}

function getCurrentAttachmentNumber(sysid) {
  if ($$('.attachmentNumber_' + sysid)[0] == undefined) {
    if ($('header_attachment_list_label') == undefined)
      return undefined;
    else
      return $('header_attachment_list_label').down().innerHTML;
  }
  return $$('.attachmentNumber_' + sysid)[0].innerHTML;
}

function updateAttachmentCount2(number, sysid) {
  var buttons = $$('.attachmentNumber_' + sysid);
  if (buttons[0] == undefined)
    $('header_attachment_list_label').down().innerHTML = number;
  else {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].innerHTML = number;
    }
  }
}

function changeCount(sysid, type) {
  var number = getCurrentAttachmentNumber(sysid);
  if (number != undefined) {
    if (type == 'increase')
      number++;
    else
      number--;
    updateAttachmentCount2(number, sysid);
  }
}

function deleteAttachment(sysid) {
  var gr = new GlideRecord('sys_attachment');
  var parentRecord = recordAttachmentBelongsTo(sysid);
  gr.addQuery('sys_id', sysid);
  gr.query();
  if (gr.next()) {
    if (confirmDeletion(gr.file_name, sysid)) {
      var ol = GlideOverlay.get('attachment_manager_overlay');
      alert(ol._box.select('div[data-id="' + sysid + '"]')[0].up().up().inspect());
      ol._box.select('div[data-id="' + sysid + '"]')[0].up().up().remove();
      ol.autoDimension();
      $("attachment_" + sysid).remove();
      if (numberOfAttachments(gr.table_sys_id) == 1) {
        hideObject($("header_attachment_list_label"));
        var line = $("header_attachment_line");
        if (line) {
          line.setStyle({
            visibility: "hidden",
            display: "none"
          });
        }
        $("header_attachment").style.height = "auto";
        ol.close();
      }
      gr.deleteRecord();
      updateAttachmentCount(parentRecord);
    }
  }
}

function saveAttachment(tableName, sys_id) {
  var g_dialog = new GlideDialogWindow('attachment');
  g_dialog.setTitle(getMessage('Attachments'));
  g_dialog.setPreference('target_table', tableName);
  g_dialog.setPreference('target_sys_id', sys_id);
  g_dialog.setPreference('attachment_disabled',
    (window["AttachmentUploader"] ? AttachmentUploader.isAttachmentDisabled() : "false"));
  g_dialog.on("closeconfirm", _saveAttachmentConfirm);
  g_dialog.render();
}

function _saveAttachmentConfirm(dialog) {
  var attachmentRows = $$('.attachmentRow');
  var value = '';
  for (var i = 0; i < attachmentRows.length; i++) {
    if (isMSIE) {
      var files = attachmentRows[i].select('input')[0].getValue();
      if (!files.empty())
        value += files + "\n";
    } else {
      var files = attachmentRows[i].select('input')[0].files;
      for (var j = 0; j < files.length; j++) {
        if (files[j] != null) {
          value += files[j].name + "\n";
        }
      }
    }
  }
  if (!value.empty())
    if (!confirm(getMessage("Close before uploading attachments?") + "\n" + value.substring(0, value.length - 1)))
      return false;
  _saveAttachmentClose();
  return true;
}

function _saveAttachmentClose() {
  var modified = $("attachments_modified");
  if (modified) {
    var attachmentsModified = modified.value;
    if (attachmentsModified != "true")
      return;
  }
  if (typeof g_form == "undefined")
    return;
  if (g_form.newRecord)
    g_form.modified = true;
  if (typeof GlideLists2 == "undefined")
    return;
  for (var id in GlideLists2) {
    var list = GlideLists2[id];
    if (list.getTableName() === 'sys_attachment')
      list.refresh();
  }
}

function allowInPlaceEditModification(elem, event) {
  var length = (elem.textContent != null) ? elem.textContent.length : elem.innerText.length;
  var max_length = maximumCharacterLimit();
  if (length >= max_length) {
    var keyCode = (event) ? event.keyCode : window.event.keyCode;
    switch (keyCode) {
      case Event.KEY_LEFT:
      case Event.KEY_RIGHT:
      case Event.KEY_UP:
      case Event.KEY_DOWN:
      case Event.KEY_BACKSPACE:
        return true;
      default:
        alert("Filename has reached the character limit of " + max_length + ".");
        return false;
    }
  }
  return true;
}

function maximumCharacterLimit() {
  var f = $('header_attachment_list');
  if (f)
    return f.getAttribute('data-max-filename-length');
  return 100;
}

function confirmDeletion(file_name, sysid) {
  var r = confirm("Are you sure you want to delete " +
    file_name +
    "?");
  return r;
}