/**
 * Top level namespace for javascript-calendars, a general purpose calendar
 * and date calculations library.
 */
var calendars = {};

/**
 * The Day type, which may include associated information from any calendar system.
 */
calendars.day = (function() {
  function day(arg) {
    if(!arg || arg === null) {
      arg = new Date();
    }
    var builder_name = 'from_' + arg.constructor.name;
    for(var name in calendars.counts) {
      var count = calendars.counts[name];
      if(!count.hasOwnProperty(builder_name)) continue;
      var builder = count[builder_name];
      this[name] = builder(arg);
    }
  };
  return day;
})();

/**
 * A collection of counts i.e. calendar systems.  Each calendar system should be added to this object.
 */
calendars.counts = {};

calendars.version_ = {
  major: 0,
  minor: 0,
  build: 1,
  revision: 1,
};

