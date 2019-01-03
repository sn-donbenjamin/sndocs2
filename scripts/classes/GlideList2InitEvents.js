/*! RESOURCE: /scripts/classes/GlideList2InitEvents.js */
function glideList2InitEvents() {
  document.body.on('click', 'a[data-type="list2_top_title"], button[data-type="list2_top_title"]', function(evt, element) {
    GlideList2.get(element.getAttribute('data-list_id')).clickTitle(evt);
    evt.stop();
  });
  document.body.on('contextmenu', '.list_nav_top', function(evt, element) {
    if (!element.hasAttribute('data-list_id'))
      return;
    if (evt.ctrlKey)
      return;
    if (evt.target.tagName.toLowerCase() === 'input')
      return;
    GlideList2.get(element.getAttribute('data-list_id')).clickTitle(evt);
    evt.stop();
  });
  document.body.on('click', 'a[data-type="list2_toggle"]', function(evt, element) {
    GlideList2.get(element.getAttribute('data-list_id')).toggleList();
    evt.stop();
  });
  if (isDoctype()) {
    $j('input[data-type="list2_checkbox"] + label.checkbox-label').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var input = $j(e.target).parent()[0].querySelector('input');
      input.checked = !input.checked;
      GlideList2.get(input.getAttribute('data-list_id')).rowChecked(input, e);
    });
  } else {
    document.body.on('click', 'input[data-type="list2_checkbox"], label[data-type="list2_checkbox"]', function(evt, element) {
      GlideList2.get(element.getAttribute('data-list_id')).rowChecked(element, evt);
      evt.stopPropagation();
    });
  }
  document.body.on('click', 'input[data-type="list2_all_checkbox"]', function(evt, element) {
    GlideList2.get(element.getAttribute('data-list_id')).allChecked(element);
    evt.stopPropagation();
  });
  document.body.on('click', 'a[data-type="list2_group_toggle"]', function(evt, element) {
    GlideList2.get(element.getAttribute('data-list_id')).toggleGroups();
    evt.stop();
  });
  document.body.on('click', 'img[data-type="list2_delete_row"], i[data-type="list2_delete_row"]', function(evt, element) {
    var gl = GlideList2.get(element.getAttribute('data-list_id'));
    var row = gl._getRowRecord(element);
    editListWithFormDeleteRow(row.sysId, gl.listID);
  });
  document.body.on('click', 'img[data-type="list2_hier"], i[data-type="list2_hier"]', function(evt, element) {
    var gl = GlideList2.get(element.getAttribute('data-list_id'));
    var row = gl._getRowRecord(element);
    gl.toggleHierarchy(element, 'hier_row_' + gl.listID + '_' + row.sysId, row.target, row.sysId);
    evt.stop();
  });
  document.on('mouseover', 'img[data-type="list2_popup"], a[data-type="list2_popup"]', function(evt, element) {
    var gl = GlideList2.get(element.getAttribute('data-list_id'));
    var row = gl._getRowRecord(element);
    popListDiv(evt, row.target, row.sysId, gl.view, 600);
    evt.stop();
  });
  document.on('mouseout', 'img[data-type="list2_popup"], a[data-type="list2_popup"]', function(evt, element) {
    lockPopup(evt);
    evt.stop();
  });
  document.body.on('click', 'a[data-type="list2_hdrcell"]', function(evt, element) {
    element = element.up("TH");
    GlideList2.get(element.getAttribute('data-list_id')).hdrCellClick(element, evt);
    evt.stop();
  });
  document.body.on('contextmenu', 'th[data-type="list2_hdrcell"]', function(evt, element) {
    GlideList2.get(element.getAttribute('data-list_id')).hdrCellContextMenu(element, evt);
  });
  document.body.on('click', 'a.list_header_context', function(evt, element) {
    element = element.parentElement;
    GlideList2.get(element.getAttribute('data-list_id')).hdrCellContextMenu(element, evt);
    evt.stop();
  });
  document.body.on('click', 'i.list_header_context', function(evt, element) {
    element = element.parentElement.parentElement;
    GlideList2.get(element.getAttribute('data-list_id')).hdrCellContextMenu(element, evt);
    evt.stop();
  });
  document.body.on('click', 'span[data-type="list2_hdrcell"]', list2Context);

  function list2Context(evt, element) {
    element = element.up("th");
    GlideList2.get(element.getAttribute('data-list_id')).hdrCellContextMenu(element, evt);
  }
  document.body.on('contextmenu', 'tr[data-type="list2_row"]', function(evt, element) {
    GlideList2.get(element.getAttribute('data-list_id')).rowContextMenu(element, evt);
  });
  document.body.on('click', 'a[data-type="list_mechanic2_open"], i[data-type="list_mechanic2_open"]', function(evt, element) {
    GlideList2.get(element.getAttribute('data-list_id')).listMechanicClick(element);
    evt.stop();
  });
  document.body.on('click', 'a.linked, a.web, a.kb_link, a.report_link, .list_decoration > a', function(evt, el) {
    if (!evt.shiftKey)
      return;
    var url = new GlideURL(el.getAttribute('href'));
    var table = url.getContextPath().split('.do')[0];
    var sys_id = url.getParam('sys_id');
    var view = url.getParam('sysparm_view');
    popForm(evt, table, sys_id, view);
    evt.stop();
  })
}
if (!window['g_isGlideList2InitEvents']) {
  addAfterPageLoadedEvent(glideList2InitEvents);
  window.g_isGlideList2InitEvents = true;
};