/*! RESOURCE: /scripts/classes/event/GwtObservable.js */
var GwtObservable = Class.create({
  initialize: function() {
    this.events = {};
  },
  on: function(name, func) {
    if (!func || typeof func != 'function')
      return;
    this.events = this.events || {};
    if (!this.events[name])
      this.events[name] = [];
    this.events[name].push(func);
  },
  forward: function(name, element, func) {
    GwtObservable.prototype.on.call(this, name, func);
    Event.observe(element, name, function(e) {
      this.fireEvent(e.type, this, e);
    }.bind(this));
  },
  un: function(name, func) {
    if (!this.events[name])
      return;
    var i = this.events[name].indexOf(func);
    if (i !== -1)
      this.events[name].splice(i, 1);
  },
  unAll: function(name) {
    if (this.events[name])
      delete this.events[name];
  },
  isFiring: function() {
    return this._isFiring;
  },
  fireEvent: function() {
    if (this.suppressEvents === true)
      return true;
    this.events = this.events || {};
    var args = $A(arguments);
    var name = args.shift();
    var eventList = this.events[name];
    if (!eventList)
      return true;
    var event = eventList.slice();
    this._isFiring = true;
    for (var i = 0, l = event.length; i < l; i++) {
      var ev = event[i];
      if (ev == null)
        continue;
      if (ev.apply(this, args) === false) {
        this._isFiring = false;
        return false;
      }
    }
    this._isFiring = false;
    return true;
  },
  toString: function() {
    return 'GwtObservable';
  }
});;