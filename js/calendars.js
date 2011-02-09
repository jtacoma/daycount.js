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

/**
 * Gregorian calendar system, as already implemented in system datetime libraries everywhere.
 */
calendars.counts.gregorian = (function() {

  function gregorian(arg) {
    this.year = parseInt(arg && arg.year);
    this.month = parseInt(arg && arg.month);
    this.date = parseInt(arg && arg.date);
    this.isLeapYear = (!(this.year % 4) && (this.year % 100) || !(this.year % 400)) != 0;
  };

  // Instance methods:

  function plus(days) {
    // Set time of day to 12:00 to eliminate possible error due to time zone fluctuations:
    var system = new Date(this.year, this.month - 1, this.date + days, 12);
    return gregorian.from_Date(system);
  };
  gregorian.prototype.plus = plus;

  // Class methods:

  function from_Date(system) {
    return new calendars.counts.gregorian({
      year: system.getFullYear(),
      month: system.getMonth() + 1,
      date: system.getDate(),
    });
  };
  gregorian.from_Date = from_Date;

  return gregorian;
})();
/**
 * Julian day numbering system.
 */
calendars.counts.julianDay = (function() {

  function julianDay(arg) {
    if(typeof(arg) == 'object') arg = arg.number;
    this.number = parseInt(arg);
  };

  // Instance methods:

  function plus(days) {
    return new calendars.counts.julianDay(this.number + days);
  };
  julianDay.prototype.plus = plus;

  // Class methods:

  function from_Date(system) {
    // from Wikipedia's Julian_day article:
    var a = parseInt((13 - system.getMonth()) / 12);
    var y = system.getFullYear() + 4800 - a;
    var m = system.getMonth() + (12 * a) - 2;
    var number = system.getDate() + Math.floor((153 * m + 2) / 5)
             + 365 * y + Math.floor(y / 4) - Math.floor(y / 100)
             + Math.floor(y / 400) - 32045;
    return new calendars.counts.julianDay({
      number: number,
    });
  };
  julianDay.from_Date = from_Date;

  return julianDay;
})();
