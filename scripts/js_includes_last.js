/*! RESOURCE: /scripts/js_includes_last.js */
/*! RESOURCE: /scripts/event_initialize.js */
$(document.body);
addAfterPageLoadedEvent(function() {
  document.on('keypress', 'input[data-type="ac_reference_input"]', function(evt, element) {
    acPopulate(element);
    acReferenceKeyPress(element, evt);
  });
  document.on('keydown', 'input[data-type="ac_reference_input"]', function(evt, element) {
    acPopulate(element);
    acReferenceKeyDown(element, evt);
  });
  document.on('keyup', 'input[data-type="ac_reference_input"]', function(evt, element) {
    acPopulate(element);
    acReferenceKeyUp(element, evt);
  });

  function acPopulate(element) {
    var answer = element.ac;
    if (answer)
      return answer;
    var c = element.getAttribute('data-completer');
    var ref = element.getAttribute('data-ref');
    var d = element.getAttribute('data-dependent');
    var rq = element.getAttribute('data-ref-qual');
    new window[c](element, ref, d, rq);
  }
  document.body.on('click', 'a[data-type="ac_reference_input"]', function(evt, element) {
    var name = element.getAttribute('data-for');
    var target = $(name);
    acPopulate(target);
    mousePositionSave(evt);
    var ref = target.getAttribute('data-ref');
    var d = target.getAttribute('data-dependent');
    var rq = target.getAttribute('data-ref-qual');
    var n = target.getAttribute('data-name');
    var table = target.getAttribute('data-table');
    reflistOpen(ref, n, table, d, 'false', rq);
  });
  document.body.on('click', 'a[data-type="reference_popup"]', function(evt, element) {
    var table = element.getAttribute('data-table');
    var form = element.getAttribute('data-form');
    var ref = element.getAttribute('data-ref');
    var refKey = element.getAttribute('data-ref-key');
    checkSave(table, form, ref, refKey);
  });
  document.on('mouseover', 'a[data-type="reference_popup"], a[data-type="reference_hover"]', function(evt, element) {
    var ref = element.getAttribute('data-ref');
    var view = element.getAttribute('data-view');
    var refKey = element.getAttribute('data-ref-key');
    popReferenceDiv(evt, ref, view, null, refKey);
  });
  document.on('mouseout', 'a[data-type="reference_popup"], a[data-type="reference_hover"]', function(evt, element) {
    lockPopup(evt);
  });
  document.body.on('click', 'a[data-type="reference_hover"]', function(evt, element) {
    alert(getMessage("Reference field click-through not available when updating multiple records"));
  });
  document.body.on('click', 'img[data-type="section_toggle"], span[data-type="section_toggle"]', function(evt, element) {
    var id = element.getAttribute("data-id");
    var prefix = element.getAttribute("data-image-prefix");
    var first = element.getAttribute("data-first");
    toggleSectionDisplay(id, prefix, first);
  });
  document.body.on('click', '[data-type="glide_list_unlock"]', function(evt, element) {
    var ref = element.getAttribute("data-ref");
    unlock(element, ref, ref + "_edit", ref + "_nonedit");
    toggleGlideListIcons(ref, false);
    var spaceElement = $('make_spacing_ok_' + ref);
    if (spaceElement)
      spaceElement.style.display = 'none';
    toggleAddMe(ref);
    evt.stop();
  });
  document.body.on('click', '[data-type="glide_list_remove"]', function(evt, element) {
    var ref = element.getAttribute("data-ref");
    simpleRemoveOption($('select_0' + ref));
    toggleGlideListIcons(ref);
    evt.stop();
  });
  document.body.on('click', '[data-type="glide_list_lock"]', function(evt, element) {
    var ref = element.getAttribute("data-ref");
    lock(element, ref, ref + "_edit", ref + "_nonedit", "select_0" + ref, ref + "_nonedit");
    var spaceElement = $('make_spacing_ok_' + ref);
    if (spaceElement)
      spaceElement.style.display = 'inline';
    toggleAddMe(ref);
    evt.stop();
  });
  document.body.on('click', '[data-type="glide_list_add_me"]', function(evt, element) {
    var ref = element.getAttribute("data-ref");
    var u = element.getAttribute("data-user-id");
    var name = element.getAttribute("data-user").replace(/\\'/, "'");
    addGlideListChoice('select_0' + ref, u, name);
    evt.stop();
  });
  document.body.on('click', '[data-type="glide_list_add_me_locked"]', function(evt, element) {
    var ref = element.getAttribute("data-ref");
    var u = element.getAttribute("data-user-id");
    var name = element.getAttribute("data-user").replace(/\\'/, "'");
    addGlideListChoice('select_0' + ref, u, name);
    lock($(ref + "_lock"), ref, ref + "_edit", ref + "_nonedit", "select_0" + ref, ref + "_nonedit");
    element.hide();
    evt.stop();
  });
  document.on('contextmenu', 'td[data-type="label"]', function(evt, element) {
    if (!elementAction(element, evt))
      evt.stop();
  });
  document.on('contextmenu', 'td[data-type="section_head"]', function(evt, element) {
    var id = element.getAttribute("data-id");
    if (!contextShow(evt, id, -1, 0, 0))
      evt.stop();
  });
});;
/*! RESOURCE: /scripts/classes/ui/GlideDraggable.js */
var GlideDraggable = Class.create({
  V_SCROLL_REFRESH_FREQ_MS: 70,
  H_SCROLL_REFRESH_FREQ_MS: 50,
  initialize: function(hoverElem, dragElem) {
    this.setHoverElem(hoverElem);
    if (this.hoverElem == null)
      return;
    this.setDragElm(dragElem || this.hoverElem);
    this.boundElem = document.body;
    this.setDragFunction(this.genericDrag);
    this.onScroll = {};
    this.allowedClasses = [];
  },
  destroy: function() {
    this.reset();
    this.hoverElem = null;
    this.dragElem = null;
    this.boundElem = null;
    this.onStart = null;
    this.onDrag = null;
    this.onScroll = null;
    this.onEnd = null;
  },
  reset: function() {
    clearInterval(this.leftScrollId);
    clearInterval(this.rightScrollId);
    clearInterval(this.topScrollId);
    clearInterval(this.bottomScrollId);
    this.leftScrollId = null;
    this.rightScrollId = null;
    this.topScrollId = null;
    this.bottomScrollId = null;
    delete this._origDragElmCoords;
    delete this._origPageCoords;
    delete this._shift;
    delete this._pageCoords;
    delete this._dragElmCoords;
  },
  genericDrag: function(e, dragElem, pageCoords, shift, dragCoords) {
    dragElem.style.left = dragCoords.x + 'px';
    dragElem.style.top = dragCoords.y + 'px';
  },
  setHoverCursor: function(c) {
    this.hoverCursor = c;
    this.hoverElem.style.cursor = c;
  },
  setHoverElem: function(obj) {
    this.hoverElem = $(obj);
    if (this.hoverElem) {
      this.hoverElem.style.MozUserSelect = '-moz-none';
      this.hoverElem.onselectstart = function() {
        return false;
      };
    }
  },
  getHoverElem: function() {
    return this.hoverElem;
  },
  setDragCursor: function(c) {
    this.dragCursor = c;
    if (this.pageShim)
      this.pageShim.style.cursor = this.dragCursor;
  },
  setDragElm: function(obj) {
    this.dragElem = $(obj);
    this.dragElem.style.MozUserSelect = '-moz-none';
  },
  setStartFunction: function(f) {
    if (this._fDraggableStart)
      document.stopObserving('mousedown', this._fDraggableStart);
    this._fDraggableStart = this._draggableStart.bind(this);
    this.hoverElem.observe('mousedown', this._fDraggableStart);
    this.onStart = f;
  },
  setDragFunction: function(f) {
    this.onDrag = f;
  },
  setEndFunction: function(f) {
    this.onEnd = f;
  },
  setAutoScrollLeft: function(f, x) {
    this.onScroll.LEFT = f;
    this.onScroll.LEFTX = x;
  },
  setAutoScrollRight: function(f, x) {
    this.onScroll.RIGHT = f;
    this.onScroll.RIGHTX = x;
  },
  setAutoScrollTop: function(f, y) {
    this.onScroll.TOP = f;
    this.onScroll.TOPX = y;
  },
  setAutoScrollBottom: function(f, y) {
    this.onScroll.BOTTOM = f;
    this.onScroll.BOTTOMX = y;
  },
  addAllowedTargetClass: function(className) {
    this.allowedClasses.push(className);
  },
  start: function(event) {
    this._getCoords(event);
    if (window.GlideContextMenu && typeof GlideContextMenu.closeAllMenus == 'function' && event.target && !$(event.target).up('.cm_menuwrapper')) {
      GlideContextMenu.closeAllMenus();
    }
    this._fDraggableMove = this._draggableMove.bind(this);
    this._fdraggableEnd = this._draggableEnd.bind(this);
    document.observe('mousemove', this._fDraggableMove);
    document.observe('mouseup', this._fdraggableEnd);
    if (this.dragCursor)
      this.dragElem.style.cursor = this.dragCursor;
    document.body.focus();
    document.onselectstart = function() {
      return false;
    };
  },
  _createPageShim: function() {
    this.pageShim = document.createElement('div');
    this.boundElem.appendChild(this.pageShim);
    this.pageShim.style.top = 0;
    this.pageShim.style.left = 0;
    this.pageShim.style.width = '100%';
    this.pageShim.style.height = '100%';
    this.pageShim.style.position = 'absolute';
    this.pageShim.style.display = 'block';
    this.pageShim.style.zIndex = '9999';
    this.pageShim.style.backgroundColor = Prototype.Browser.IE ? '#ccc' : 'transparent';
    this.pageShim.style.opacity = '0';
    this.pageShim.style.filter = 'alpha(opacity=0)';
    if (this.dragCursor) {
      this.pageShim.style.cursor = this.dragCursor;
      this.dragElem.style.cursor = this.dragCursor;
    }
  },
  _removePageShim: function() {
    if (this.pageShim)
      this.pageShim.parentNode.removeChild(this.pageShim);
    this.pageShim = null;
  },
  _getCoords: function(event) {
    event = event || window.event;
    if (!event.pageX) {
      event.pageX = event.clientX;
      event.pageY = event.clientY;
    }
    if (!this._origPageCoords)
      this._origPageCoords = {
        x: event.pageX,
        y: event.pageY
      };
    if (!this._origDragElmCoords) {
      var cumulativeOffset = this.dragElem.cumulativeOffset();
      if (this.dragElem.style.right) {
        this.dragElem.style.left = (this.dragElem.up().getWidth() - this.dragElem.getWidth() - parseInt(this.dragElem.style.right, 10)) + 'px';
        this.dragElem.setStyle({
          right: ''
        });
      }
      this._origDragElmCoords = {
        x: parseInt(this.dragElem.style.left, 10) || cumulativeOffset.left,
        y: parseInt(this.dragElem.style.top, 10) || cumulativeOffset.top
      };
    }
    this._shift = !this._pageCoords ? {
      x: 0,
      y: 0
    } : {
      x: (event.pageX - this._pageCoords.x),
      y: (event.pageY - this._pageCoords.y)
    };
    this._pageCoords = {
      x: event.pageX,
      y: event.pageY
    };
    this._dragElmCoords = {
      x: this._origDragElmCoords.x + (this._pageCoords.x - this._origPageCoords.x),
      y: this._origDragElmCoords.y + (this._pageCoords.y - this._origPageCoords.y)
    };
  },
  _draggableStart: function(event) {
    var l = this.allowedClasses.length;
    if (l > 0) {
      var boolCanStart = false;
      for (var i = 0; i < l; i++) {
        if (event.target.className == this.allowedClasses[i]) {
          boolCanStart = true;
          break;
        }
      }
      if (!boolCanStart)
        return true;
    }
    this.start(event);
    return this.onStart(event, this.dragElem, this._pageCoords, this._shift, this._dragElmCoords, this);
  },
  _draggableMove: function(event) {
    this._getCoords(event);
    if (!this.pageShim) {
      this._createPageShim();
      if (Prototype.Browser.IE)
        this.dragElem.up().onselectstart = function() {
          return false;
        };
    }
    if (this._shift.x == 0 && this._shift.y == 0)
      return;
    if (this.onScroll.LEFT && this._pageCoords.x < this.onScroll.LEFTX) {
      if (!this.leftScrollId)
        this.leftScrollId = setInterval(this._autoXScrollerInterceptor.bind(this, this.onScroll.LEFT, this.onScroll.LEFTX), this.H_SCROLL_REFRESH_FREQ_MS);
      if (this._shift.y == 0)
        return;
    } else if (this.onScroll.LEFT && this.leftScrollId && this._pageCoords.x >= this.onScroll.LEFTX) {
      clearInterval(this.leftScrollId);
      this.leftScrollId = null;
    }
    if (this.onScroll.RIGHT && this._pageCoords.x > this.onScroll.RIGHTX) {
      if (!this.rightScrollId)
        this.rightScrollId = setInterval(this._autoXScrollerInterceptor.bind(this, this.onScroll.RIGHT, this.onScroll.RIGHTX), this.H_SCROLL_REFRESH_FREQ_MS);
      if (this._shift.y == 0)
        return;
    } else if (this.onScroll.RIGHT && this.rightScrollId && this._pageCoords.x <= this.onScroll.RIGHTX) {
      clearInterval(this.rightScrollId);
      this.rightScrollId = null;
    }
    if (this.onScroll.TOP && this._pageCoords.y < this.onScroll.TOPX) {
      if (!this.topScrollId)
        this.topScrollId = setInterval(this._autoYScrollerInterceptor.bind(this, this.onScroll.TOP, this.onScroll.TOPX), this.V_SCROLL_REFRESH_FREQ_MS);
      if (this._shift.x == 0)
        return;
    } else if (this.onScroll.TOP && this.topScrollId && this._pageCoords.y >= this.onScroll.TOPX) {
      clearInterval(this.topScrollId);
      this.topScrollId = null;
    }
    if (this.onScroll.BOTTOM && this._pageCoords.y > this.onScroll.BOTTOMX) {
      if (!this.bottomScrollId)
        this.bottomScrollId = setInterval(this._autoYScrollerInterceptor.bind(this, this.onScroll.BOTTOM, this.onScroll.BOTTOMX), this.V_SCROLL_REFRESH_FREQ_MS);
      if (this._shift.x == 0)
        return;
    } else if (this.onScroll.BOTTOM && this.bottomScrollId && this._pageCoords.y <= this.onScroll.BOTTOMX) {
      clearInterval(this.bottomScrollId);
      this.bottomScrollId = null;
    }
    this.onDrag(event, this.dragElem, this._pageCoords, this._shift, this._dragElmCoords, this);
    return false;
  },
  _autoXScrollerInterceptor: function(f, boundaryX) {
    f(this.dragElem, this._pageCoords.x - boundaryX, this._pageCoords);
  },
  _autoYScrollerInterceptor: function(f, boundaryY) {
    f(this.dragElem, this._pageCoords.y - boundaryY, this._pageCoords);
  },
  _draggableEnd: function(event) {
    this._removePageShim();
    document.onselectstart = null;
    if (Prototype.Browser.IE)
      this.dragElem.up().onselectstart = null;
    if (this.hoverCursor)
      this.hoverElem.style.cursor = this.hoverCursor;
    document.stopObserving('mousemove', this._fDraggableMove);
    document.stopObserving('mouseup', this._fdraggableEnd);
    event.stopPropagation();
    this._getCoords(event);
    var boolReturn = this.onEnd ? this.onEnd(event, this.dragElem, this._pageCoords, this._shift, this._dragElmCoords, this) : true;
    this.reset();
    return boolReturn;
  },
  toString: function() {
    return 'GlideDraggable';
  }
});;
/*! RESOURCE: /scripts/classes/ui/GlideBox.js */
var g_glideBoxes = {};
var GlideBox = Class.create({
      QUIRKS_MODE: document.compatMode != 'CSS1Compat',
      initialize: function(options) {
        if (isMSIE9)
          this.QUIRKS_MODE = this._isQuirksMode();
        this.options = Object.extend({
          id: typeof options == 'string' ? options : guid(),
          title: 'Default Title',
          boxClass: '',
          body: '',
          form: null,
          iframe: null,
          iframeId: null,
          bodyPadding: 4,
          fadeOutTime: 200,
          draggable: true,
          showClose: true,
          parent: document.body,
          boundingContainer: options.parent || document.body,
          position: Prototype.Browser.IE || options.parent ? 'absolute' : 'fixed',
          allowOverflowY: true,
          allowOverflowX: true,
          height: null,
          maxHeight: null,
          minHeight: 50,
          width: null,
          minWidth: 70,
          maxWidth: null,
          top: null,
          bottom: null,
          maxTop: null,
          minBottom: null,
          left: null,
          right: null,
          preferences: {},
          onBeforeLoad: function() {},
          onAfterLoad: function() {},
          onBeforeHide: function() {},
          onAfterHide: function() {},
          onBeforeShow: function() {},
          onAfterShow: function() {},
          onBeforeClose: function() {},
          onAfterClose: function() {},
          onBeforeDrag: function() {},
          onAfterDrag: function() {},
          onBeforeResize: function() {},
          onAfterResize: function() {},
          onHeightAdjust: function() {},
          onWidthAdjust: function() {},
          autoDimensionOnPreLoad: true,
          autoDimensionOnLoad: true,
          autoPositionOnLoad: true,
          fadeInTime: 250
        }, options || {});
        this.options.padding = Object.extend({
          top: 15,
          right: 15,
          bottom: 15,
          left: 15
        }, this.options.padding || {});
        this._iframeShim = null;
        this._dataCache = {};
        this._box = $(document.createElement('div'));
        this._box.id = this.options.id;
        this._box.className = (new Array('glide_box', 'gb_mw', trim(this.options.boxClass), this.options.iframe && this.options.iframe != '' ? 'iframe' : '').join(' '));
        this._box.setAttribute('role', 'dialog');
        this._box.innerHTML = gb_BoxTemplateInner;
        if (this._box.hasClassName('frame'))
          this.getBodyWrapperElement().update(gb_BodyFrameTemplate);
        this.options.parent.appendChild(this._box);
        this.setBody(this.options.body);
        this.setBodyPadding(this.options.bodyPadding);
        if (this.options.titleHtml)
          this.setTitleHtml(this.options.titleHtml)
        else
          this.setTitle(this.options.title);
        this.setDraggable(this.options.draggable);
        this.setStyle({
          position: this.options.position
        });
        if (this.options.maxWidth)
          this.setMaxWidth(this.options.maxWidth);
        if (this.options.showClose)
          this.addToolbarCloseButton();
        if (this.options.allowOverflowY === false)
          this.getBodyElement().setStyle({
            overflowY: 'hidden'
          });
        if (this.options.allowOverflowX === false)
          this.getBodyElement().setStyle({
            overflowX: 'hidden'
          });
        g_glideBoxes[this.options.id] = this;
      },
      getId: function() {
        return this.options.id;
      },
      getBoxElement: function() {
        return this._box;
      },
      getBoxWrapperElement: function() {
        return this._box.select('.gb_wrapper')[0];
      },
      getIFrameElement: function() {
        return this._box.select('iframe')[0];
      },
      isVisible: function() {
        return this._box.visible();
      },
      isLoading: function() {
        return this._isLoading;
      },
      setOnClick: function(f) {
        this._box.observe('click', f.bind(this));
      },
      setOnBeforeLoad: function(f) {
        this.options.onBeforeLoad = f;
      },
      setOnAfterLoad: function(f) {
        this.options.onAfterLoad = f;
      },
      setOnBeforeClose: function(f) {
        this.options.onBeforeClose = f;
      },
      setOnAfterClose: function(f) {
        this.options.onAfterClose = f;
      },
      setOnBeforeDrag: function(f) {
        this.options.onBeforeDrag = f;
      },
      setOnAfterDrag: function(f) {
        this.options.onAfterDrag = f;
      },
      setOnBeforeResize: function(f) {
        this.options.onBeforeResize = f;
      },
      setOnAfterResizes: function(f) {
        this.options.onAfterResize = f;
      },
      setOnHeightAdjust: function(f) {
        this.options.onHeightAdjust = f;
      },
      setOnWidthAdjust: function(f) {
        this.options.onWidthAdjust = f;
      },
      addData: function(key, value) {
        this._dataCache[key] = value;
      },
      getData: function(key) {
        return this._dataCache[key];
      },
      getToolbar: function() {
        return this._box.select('.gb_toolbar')[0];
      },
      addToolbarRow: function(html) {
        var thead = this._box.select('.gb_table > thead')[0];
        var td = thead.insertRow(thead.rows.length).insertCell(0);
        td.className = 'gb_table_col_l1';
        td.innerHTML = html;
        return td;
      },
      setTitle: function(html) {
        var titleZone = this._box.select('.gb_title_zone')[0];
        titleZone.addClassName('gb_toolbar_text');
        if (titleZone.firstChild)
          titleZone.removeChild(titleZone.firstChild);
        var text = document.createTextNode(html);
        titleZone.appendChild(text);
        this._box.setAttribute('aria-label', html);
      },
      setTitleHtml: function(html) {
        this._box.select('.gb_title_zone')[0].removeClassName('gb_toolbar_text').innerHTML = html;
      },
      setWindowIcon: function(html) {
        var tr = this._box.select('.gb_toolbar_left tr')[0];
        for (var i = 0, l = tr.childNodes.length; i < l; i++)
          tr.deleteCell(i);
        this.addWindowIcon(html);
      },
      addWindowIcon: function(html) {
        this.addToolbarLeftDecoration('<div style="margin-left:5px;">' + html + '</div>');
      },
      removeToolbarDecoration: function(objSelector) {
        var e = this.getToolbar().select(objSelector);
        if (!e || e.length == 0)
          return;
        if (e[0].tagName.toLowerCase() == 'td')
          var td = e;
        else if (e[0].parentNode.tagName.toLowerCase() == 'td')
          var td = e[0].parentNode;
        else
          return;
        var tr = td.parentNode;
        for (var i = 0, l = tr.childNodes.length; i < l; i++) {
          if (tr.childNodes[i] == td) {
            tr.deleteCell(i);
            break;
          }
        }
      },
      addToolbarLeftDecoration: function(html, boolPrepend) {
        return this._addToolbarDecoration(html, boolPrepend || false, '.gb_toolbar_left');
      },
      addToolbarRightDecoration: function(html, boolPrepend) {
        return this._addToolbarDecoration(html, boolPrepend || false, '.gb_toolbar_right');
      },
      addToolbarCloseButton: function() {
        var arr = this._box.getElementsByClassName('gb_close');
        if (arr.length == 1)
          return;
        var className = this._box.hasClassName('dark') || this._box.hasClassName('iframe') ?
          'icon-cross-circle i12 i12_close' :
          'icon-cross-circle i16 i16_close2';
        this.addToolbarRightDecoration('<span style="float:none;cursor:pointer;" ' +
          'tabindex="0" aria-label="Close" role="button" class="gb_close ' + className + '"></span>');
        this.setToolbarCloseOnClick(function(event) {
          this.close();
        }.bind(this));
      },
      removeToolbarCloseButton: function() {
        this.removeToolbarDecoration('.gb_close');
      },
      setToolbarCloseOnClick: function(f) {
        var arr = this._box.getElementsByClassName('gb_close');
        if (arr.length == 0)
          return;
        arr[0].stopObserving('mousedown');
        arr[0].observe('mousedown', function(event) {
          f.call(this, event);
          event.stop();
        }.bind(this));
        arr[0].stopObserving('keydown');
        arr[0].observe('keydown', function(event) {
          if (event.keyCode != 13)
            return;
          f.call(this, event);
          event.stop();
        }.bind(this));
      },
      _addToolbarDecoration: function(html, boolPrepend, tableClassSelector) {
        var table = this._box.select(tableClassSelector)[0].show();
        var tr = table.select('tr')[0];
        var td = tr.insertCell(boolPrepend ? 0 : -1);
        td.innerHTML = html;
        return td;
      },
      getFooter: function() {
        return this._box.select('.gb_footer')[0];
      },
      showFooter: function() {
        if (this._isFooterVisible === true)
          return;
        this.getFooter().show();
        this._box.select('.gb_table > tfoot')[0].setStyle({
          display: 'table-footer-group'
        });
        this._isFooterVisible = true;
      },
      hideFooter: function() {
        if (!this._isFooterVisible !== true)
          return;
        this.getFooter().hide();
        this._box.select('.gb_table > tfoot')[0].setStyle({
          display: 'none'
        });
        this._isFooterVisible = false;
      },
      showFooterResizeGrips: function() {
        this.showFooter();
        var footer = this.getFooter();
        if (!footer.select('.i16_resize_grip_left'))
          return;
        footer.select('.gb_footer_left_resize')[0].innerHTML = '<span class="i16 i16_resize_grip_left" style="float:none;" />';
        footer.select('.gb_footer_right_resize')[0].innerHTML = '<span class="i16 i16_resize_grip_right" style="float:none;" />';
        this.leftResizeDragger = new GlideDraggable(footer.select('.i16_resize_grip_left')[0], footer);
        this.leftResizeDragger.setHoverCursor('sw-resize');
        this.leftResizeDragger.setDragCursor('sw-resize');
        this.leftResizeDragger.setStartFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
          var dims = this._getViewportDimensions();
          var offsets = document.viewport.getScrollOffsets();
          this._currentOffset = this.getOffset();
          this._currentOffset.right = this._currentOffset.left + this.getWidth();
          this._isLeftPositioned = this.convertToRightPosition();
          this._maxWidth = this._currentOffset.right - this.options.padding.left - offsets.left;
          this._maxHeight = dims.height - this.options.padding.top - this._currentOffset.top + offsets.top;
          this.options.onBeforeResize.call(this);
        }.bind(this));
        this.leftResizeDragger.setDragFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
          this.setWidth(Math.min(this._maxWidth, (this._currentOffset.right - pageCoords.x)));
          this.setHeight(Math.min(this._maxHeight, (pageCoords.y - this._currentOffset.top)));
        }.bind(this));
        this.leftResizeDragger.setEndFunction(function() {
          if (this._isLeftPositioned)
            this.convertToLeftPosition();
          this._isLeftPositioned = null;
          this.options.onAfterResize.call(this);
        }.bind(this));
        this.rightResizeDragger = new GlideDraggable(footer.select('.i16_resize_grip_right')[0], footer);
        this.rightResizeDragger.setHoverCursor('se-resize');
        this.rightResizeDragger.setDragCursor('se-resize');
        this.rightResizeDragger.setStartFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
          var dims = this._getViewportDimensions();
          var offsets = document.viewport.getScrollOffsets();
          this._currentOffset = this.getOffset();
          this._isRightPositioned = this.convertToLeftPosition();
          this._maxWidth = dims.width - this.options.padding.left - this._currentOffset.left + offsets.left;
          this._maxHeight = dims.height - this.options.padding.top - this._currentOffset.top + offsets.top;
          this.options.onBeforeResize.call(this);
        }.bind(this));
        this.rightResizeDragger.setDragFunction(function(e, dragElem, pageCoords, shift, dragCoords) {
          this.setWidth(Math.min(this._maxWidth, (pageCoords.x - this._currentOffset.left)));
          this.setHeight(Math.min(this._maxHeight, (pageCoords.y - this._currentOffset.top)));
        }.bind(this));
        this.rightResizeDragger.setEndFunction(function() {
          if (this._isRightPositioned)
            this.convertToRightPosition();
          this._isRightPositioned = null;
          this.options.onAfterResize.call(this);
        }.bind(this));
      },
      hideFooterResizeGrips: function() {
        this.leftResizeDragger.destroy();
        this.rightResizeDragger.destroy();
        this.leftResizeDragger = null;
        this.rightResizeDragger = null;
        this._box.select('.gb_footer_left_resize')[0].innerHTML = '';
        this._box.select('.gb_footer_right_resize')[0].innerHTML = '';
      },
      getFooterContainer: function() {
        return this._box.select('.gb_footer_body > div')[0];
      },
      setFooter: function(html) {
        this.showFooter();
        this._box.select('.gb_footer_body > div')[0].innerHTML = html;
      },
      prependFooterRow: function(html) {
        return this._addFooterRow(0, html);
      },
      appendFooterRow: function(html) {
        return this._addFooterRow(-1, html);
      },
      _addFooterRow: function(pos, html) {
        var foot = this._box.select('.gb_table > tfoot')[0];
        var td = foot.insertRow(pos == -1 ? foot.rows.length : pos).insertCell(0);
        td.className = 'gb_table_col_l1';
        td.innerHTML = html;
        return td;
      },
      getMaxDimensions: function() {
        var vp = this._getViewportDimensions();
        if (this.options.parent == document.body || this.options.parent != this.options.boundingContainer)
          var res = {
            width: vp.width,
            height: vp.height
          };
        else
          var res = this.options.parent.getDimensions();
        if (this.options.boundingContainer == this.options.parent) {
          res.height -= this.options.top !== null ? this.options.top : this.options.padding.top;
          res.height -= this.options.bottom !== null ? this.options.bottom : this.options.padding.bottom;
          res.width -= this.options.left !== null ? this.options.left : this.options.padding.left;
          res.width -= this.options.right !== null ? this.options.right : this.options.padding.right;
        } else if (this.options.boundingContainer == document.body && document.loaded == true) {
          var o = this.options.parent.cumulativeOffset();
          var dims = this.options.parent.getDimensions();
          if (this.options.bottom !== null)
            res.height -= vp.height - (o.top + dims.height) + this.options.padding.top;
          else if (this.options.top !== null)
            res.height -= o.top + this.options.padding.bottom;
          if (this.options.right !== null)
            res.width -= vp.width - (o.left + dims.width) + this.options.padding.left;
          else if (this.options.left !== null)
            res.width -= o.left + this.options.padding.right;
        } else {}
        if (this.options.maxWidth)
          res.width = Math.min(res.width, this.options.maxWidth);
        if (this.options.maxHeight)
          res.height = Math.min(res.height, this.options.maxHeight);
        return res;
      },
      getDocumentHeight: function(doc) {
        var D = doc || window.document;
        return Math.max(
          Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
          Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
          Math.max(D.body.clientHeight, D.documentElement.clientHeight)
        );
      },
      getDocumentWidth: function(doc) {
        var D = doc || window.document;
        return Math.max(
          Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
          Math.max(D.body.offsetWidth, D.documentElement.offsetWidth),
          Math.max(D.body.clientWidth, D.documentElement.clientWidth)
        );
      },
      autoDimension: function() {
        this._scrollBarWidth = this._scrollBarWidth || getScrollBarWidthPx();
        var box = this._box;
        var body = this.getBodyElement();
        var bodyWrapper = this.getBodyWrapperElement();
        var extraWidth = 0;
        var innerHeight = null;
        var innerWidth = null;
        var maxDim = this.getMaxDimensions();
        var clone = null;
        box.setStyle({
          width: '',
          height: ''
        });
        bodyWrapper.setStyle({
          width: '',
          height: '',
          overflowY: 'hidden'
        });
        body.setStyle({
          width: '',
          height: ''
        });
        var iframe = this.getIFrameElement();
        if (this.options.iframe && iframe && !this.isLoading()) {
          if (!this.options.width && !this.options.height) {
            try {
              var D = iframe.contentDocument || iframe.contentWindow.document;
              innerWidth = (this.getDocumentWidth(D) + 4);
              innerHeight = (this.getDocumentHeight(D) + 4);
              if (isMacintosh && Prototype.Browser.Gecko)
                innerHeight++;
            } catch (e) {
              innerWidth = 500;
              innerHeight = 500;
            }
          } else {
            if (this.options.height) {
              var p = (this.options.height + '').match(/([0-9]*)%/);
              var diff = box.measure('border-box-height') - body.measure('border-box-height');
              if (!this.QUIRKS_MODE)
                diff = diff - box.measure('border-top') - box.measure('border-bottom');
              if (typeof this.options.height == 'number')
                innerHeight = this.options.height - diff;
              else if (typeof this.options.height == 'string' && p)
                innerHeight = (maxDim.height * (parseInt(p[1], 10) / 100)) - diff;
            }
            if (this.options.width) {
              var p = (this.options.width + '').match(/([0-9]*)%/);
              var diff = box.measure('border-box-width') - body.measure('border-box-width');
              if (!this.QUIRKS_MODE)
                diff = diff - box.measure('border-left') - box.measure('border-right');
              if (typeof this.options.width == 'number')
                innerWidth = this.options.width - diff;
              else if (typeof this.options.width == 'string' && p)
                innerWidth = (maxDim.width * (parseInt(p[1], 10) / 100)) - diff;
            }
          }
          iframe.writeAttribute('height', 0);
          iframe.writeAttribute('width', 0);
        } else {
          clone = Element.clone(box, true);
          clone.id = '';
          clone.setStyle({
            position: 'absolute',
            top: '-1999px',
            left: '-1999px',
            right: '',
            bottom: '',
            width: '',
            height: '',
            display: 'block',
            visibility: 'hidden'
          });
          clone.innerHTML = clone.innerHTML;
          document.body.appendChild(clone);
          var cloneBody = clone.select('.gb_body:first')[0];
          var diff = clone.measure('border-box-width') - cloneBody.measure('border-box-width');
          if (this.QUIRKS_MODE)
            diff = diff - clone.measure('border-left') - clone.measure('border-right');
          if (!this.options.width)
            innerWidth = Math.min(maxDim.width - diff, cloneBody.getWidth() + 1);
          else {
            var p = (this.options.width + '').match(/([0-9]*)%/);
            if (typeof this.options.width == 'number')
              innerWidth = Math.min(maxDim.width, this.options.width) - diff;
            else if (typeof this.options.width == 'string' && p)
              innerWidth = (maxDim.width * (parseInt(p[1], 10) / 100)) - diff;
          }
          cloneBody.setStyle({
            width: innerWidth + 'px'
          });
          if (!this.options.height) {
            innerHeight = cloneBody.getHeight();
            cloneBody.setStyle({
              width: innerWidth + 'px'
            });
          } else {
            var p = (this.options.height + '').match(/([0-9]*)%/);
            var diff = clone.measure('border-box-height') - cloneBody.measure('border-box-height');
            if (this.QUIRKS_MODE)
              diff = diff - box.measure('border-top') - box.measure('border-bottom');
            if (typeof this.options.height == 'number')
              innerHeight = this.options.height - diff;
            else if (typeof this.options.height == 'string' && p)
              innerHeight = (maxDim.height * (parseInt(p[1], 10) / 100)) - diff;
            cloneBody.setStyle({
              height: innerHeight + 'px'
            });
          }
        }
        if (clone && this.options.width && typeof this.options.width == 'string') {
          var per = (this.options.width + '').match(/([0-9]*)%/);
          clone.setStyle({
            width: (maxDim.width * (parseInt(per[1], 10) / 100)) + 'px'
          });
        } else if (clone && this.options.width && typeof this.options.width == 'number')
          clone.setStyle({
            width: this.options.width + 'px'
          });
        if (this.options.allowOverflowY === true)
          bodyWrapper.setStyle({
            overflowY: ''
          });
        body.style.width = innerWidth + 'px';
        body.style.height = innerHeight + 'px';
        var dims = clone ? clone.getDimensions() : box.getDimensions();
        var diffHeight = dims.height - maxDim.height;
        if (dims.height > maxDim.height) {
          extraWidth = this.options.allowOverflowY === true ? this._scrollBarWidth : 0;
          body.style.height = Math.max(0, innerHeight - diffHeight) + 'px';
          this.setHeight(maxDim.height, clone);
        } else
          this.setHeight(dims.height, clone);
        if (dims.width > maxDim.width) {
          this.setWidth(maxDim.width);
          this.setHeight(Math.min(maxDim.height, dims.height + this._scrollBarWidth), clone);
        } else
          this.setWidth(Math.min(dims.width, this.options.width && typeof this.options.width == 'number' ? this.options.width : dims.width) + extraWidth);
        if (clone)
          clone.remove();
        this._resizeIframeShim();
      },
      size: function(w, h) {
        if (w) this.setWidth(w);
        if (h) this.setHeight(h);
      },
      setMaxWidth: function(mw) {
        this.options.maxWidth = parseInt(mw, 10);
        this._box.setStyle({
          maxWidth: this.options.maxWidth + 'px'
        });
      },
      setWidth: function(w) {
        w = typeof w == 'string' ? parseInt(w, 10) : w;
        var box = this._box;
        var boxBorder = box.measure('border-left') + box.measure('border-right');
        var gbWrapper = box.select('.gb_wrapper')[0];
        var wrapperBorder = gbWrapper.measure('border-left') + gbWrapper.measure('border-right');
        var wrapper = this.getBodyWrapperElement();
        var body = this.getBodyElement();
        var iframe = this.options.iframe ? this.getIFrameElement() : null;
        w = Math.max(w, this.options.minWidth);
        var wrapperWidth = w;
        if (!this.QUIRKS_MODE || (this.QUIRKS_MODE && !Prototype.Browser.IE))
          wrapperWidth -= (boxBorder + wrapperBorder);
        if (!this.QUIRKS_MODE || (this.QUIRKS_MODE && !Prototype.Browser.IE))
          wrapperWidth -= wrapper.measure('padding-left') + wrapper.measure('padding-right');
        var ww = wrapperWidth;
        if (this.QUIRKS_MODE && Prototype.Browser.IE)
          ww += wrapperBorder + wrapper.measure('padding-left') + wrapper.measure('padding-right');
        var boxSizing = wrapper.getStyle('box-sizing');
        var bsw = ww;
        if (boxSizing == 'border-box') {
          bsw += wrapperBorder + wrapper.measure('padding-left') + wrapper.measure('padding-right');
        } else if (boxSizing == 'padding-box') {
          bsw += wrapper.measure('padding-left') + wrapper.measure('padding-right');
        }
        wrapper.setStyle({
          width: bsw + 'px'
        });
        body.setStyle({
          width: ww + 'px'
        });
        if (!this.QUIRKS_MODE || (this.QUIRKS_MODE && !Prototype.Browser.IE))
          w = w - boxBorder;
        if (this.QUIRKS_MODE && Prototype.Browser.IE) {
          w = ww - (wrapperBorder + wrapper.measure('padding-left') + wrapper.measure('padding-right'));
          body.setStyle({
            width: w + 'px'
          });
        }
        box.setStyle({
          width: w + 'px'
        });
        if (iframe) {
          var iframeWrap2 = iframe.up();
          var iframeContainer = iframeWrap2.up();
          var iframeWidth = (wrapperWidth -
            iframeWrap2.measure('border-left') - iframeWrap2.measure('border-right') -
            iframeContainer.measure('border-left') - iframeContainer.measure('border-right'));
          iframe.writeAttribute('width', iframeWidth);
        }
        var table = box.select('.gb_table')[0];
        var tw = table.getWidth();
        var realWrapperWidth = wrapper.getWidth();
        if (realWrapperWidth < tw) {
          var bodyPadding = wrapper.measure('padding-left') + wrapper.measure('padding-right');
          var nw = tw - bodyPadding;
          wrapper.setStyle({
            width: nw + 'px'
          });
          box.setStyle({
            width: (w + (tw - realWrapperWidth)) + 'px'
          });
          if (iframe)
            iframe.writeAttribute('width', nw);
        }
        this.options.onWidthAdjust.call(this);
      },
      setMinWidth: function(mw) {
        this.options.minWidth = typeof mw == 'string' ? parseInt(mw, 10) : mw;
      },
      setHeight: function(h, clone) {
        h = typeof h == 'string' ? parseInt(h, 10) : h;
        var box = clone || this._box;
        var gbWrapper = box.select('.gb_wrapper')[0];
        var boxBorder = box.measure('border-top') + box.measure('border-bottom');
        var wrapperBorder = gbWrapper.measure('border-top') + gbWrapper.measure('border-bottom');
        var bodyWrapper = box.select('.gb_body_wrapper')[0];
        var body = box.select('.gb_body')[0];
        var iframe = this.options.iframe ? this.getIFrameElement() : null;
        var table = box.select('.gb_table')[0];
        if (this.options.minHeight)
          h = Math.max(h, this.options.minHeight);
        if (iframe)
          var wrapperHeight = h - (box.getHeight() - Math.max(body.getHeight(), parseInt(body.getStyle('height'), 10)));
        else {
          var wrapperHeight = h - wrapperBorder - boxBorder - table.select('thead')[0].getHeight() - table.select('tfoot > tr')[0].getHeight();
          if (!this.QUIRKS_MODE || (this.QUIRKS_MODE && !Prototype.Browser.IE))
            wrapperHeight -= bodyWrapper.measure('padding-top') + bodyWrapper.measure('padding-bottom');
        }
        wrapperHeight = Math.max(wrapperHeight, 0);
        wh = wrapperHeight;
        if (this.QUIRKS_MODE && Prototype.Browser.IE)
          wh += wrapperBorder + bodyWrapper.measure('padding-top') + bodyWrapper.measure('padding-bottom');
        var boxSizing = bodyWrapper.getStyle('box-sizing');
        if (boxSizing == 'border-box') {
          wh += wrapperBorder + bodyWrapper.measure('padding-top') + bodyWrapper.measure('padding-bottom');
        } else if (boxSizing == 'padding-box') {
          wh += bodyWrapper.measure('padding-top') + bodyWrapper.measure('padding-bottom');
        }
        this.getBodyWrapperElement().setStyle({
          height: wh + 'px'
        });
        if (iframe) {
          var iframeWrap2 = iframe.up();
          var iframeContainer = iframeWrap2.up();
          var iframeHeight = (wrapperHeight -
            iframeWrap2.measure('border-top') - iframeWrap2.measure('border-bottom') -
            iframeContainer.measure('border-top') - iframeContainer.measure('border-bottom'));
          iframe.writeAttribute('height', iframeHeight);
        }
        h = h - boxBorder;
        this._box.setStyle({
          height: h + 'px'
        });
        this.options.onHeightAdjust.call(this);
      },
      setMinHeight: function(mh) {
        this.options.minHeight = typeof mh == 'string' ? parseInt(mh, 10) : mh;
        this._box.setStyle({
          minHeight: this.options.minHeight + 'px'
        });
      },
      getMaxPositions: function() {
        if (this.options.parent == document.body) {
          var winDimensions = this._getViewportDimensions();
          var parent = {
            width: winDimensions.width,
            height: winDimensions.height
          };
        } else {
          var parent = {
            width: this.options.parent.getWidth(),
            height: this.options.parent.getHeight()
          };
        }
        return {
          minTop: this.options.padding.top,
          minLeft: this.options.padding.left,
          maxTop: parent.height - this.getHeight() - this.options.padding.bottom,
          maxLeft: parent.width - this.getWidth() - this.options.padding.right
        };
      },
      autoPosition: function() {
        if ((this.options.left !== null || this.options.right !== null) &&
          (this.options.top !== null || this.options.bottom !== null)) {
          if (this.options.left !== null)
            this.positionLeft(this.options.left);
          else
            this.positionRight(this.options.right);
          if (this.options.top !== null)
            this.positionTop(this.options.top);
          else
            this.positionBottom(this.options.bottom);
        } else {
          if (this.options.parent == document.body) {
            var winScrollOffsets = document.viewport.getScrollOffsets();
            var winDimensions = this._getViewportDimensions();
            var height = winDimensions.height;
            var width = winDimensions.width;
            var offset = this.getStyle('position') == 'absolute' ? {
              left: winScrollOffsets.left,
              top: winScrollOffsets.top
            } : {
              left: 0,
              top: 0
            };
          } else {
            var height = this.options.parent.getHeight();
            var width = this.options.parent.getWidth();
            var offset = {
              left: 0,
              top: 0
            };
          }
          if (this.options.left !== null)
            this.positionLeft(this.options.left);
          else if (this.options.right !== null)
            this.positionRight(this.options.right);
          else
            this.positionLeft(width / 2 - this.getWidth() / 2 + offset.left)
          if (this.options.top !== null)
            this.positionTop(this.options.top);
          else if (this.options.bottom !== null)
            this.positionBottom(this.options.bottom);
          else
            this.positionTop(height / 2 - this.getHeight() / 2 + offset.top);
        }
      },
      center: function() {
          if (this.options.parent == document.body) {
            var offsets = document.viewport.getScrollOffsets();
            var winDimensions = this._getViewportDimensions();
            var heigh