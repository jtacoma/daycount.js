/**
 * Top level namespace for daycount.js, a general purpose calendar
 * and date calculations library.
 */
var daycount = {};

/**
 * The Day type, which may include associated information from any calendar system.
 */
daycount.day = (function() {
  function day(arg) {
    if(!arg || arg === null)
      arg = new Date();
    var builder_name = 'from_' + arg.constructor.name;
    this[arg.constructor.name] = arg;
    var done = [arg.constructor.name];
    var todo = []
    for(var name in daycount.counts)
      if(!this.hasOwnProperty(name))
        todo.push(name);
    var finished = false;
    while(!finished) {
      finished = true;
      for (var indexTodo = todo.length-1; indexTodo >= 0; --indexTodo) {
        var nameTodo = todo[indexTodo];
        var countTodo = daycount.counts[nameTodo];
        for (var indexDone = 0; indexDone < done.length; ++indexDone) {
          var nameDone = done[indexDone];
          var builderNameTodo = 'from_' + nameDone;
          if(!countTodo.hasOwnProperty(builderNameTodo)) continue;
          var builder = countTodo[builderNameTodo];
          this[nameTodo] = builder(this[nameDone]);
          done.push(nameTodo);
          todo.splice(indexTodo, 1)
          finished = false;
          break;
        }
      }
    }
  };
  return day;
})();

/**
 * A collection of counts i.e. calendar systems.  Each calendar system should be added to this object.
 */
daycount.counts = {};

daycount.version_ = {
  major: 0,
  minor: 0,
  build: 1,
  revision: 1,
};

daycount.counts.dreamspell = (function () {

  function dreamspell (arg) {
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    this.dayOfYear = isNaN(this.month) ? 0
      : (this.month - 1) * 28 + this.dayOfMonth;
    this.kin = parseInt(arg && arg.kin);
  };

  // Static members:

  var reference = {
    gregorian: {year:2012, month:12, dayOfMonth:21},
    dreamspell: {month:6, dayOfMonth:9, kin:207},
  };

  dreamspell.from_gregorian = function (gregorian) {
    if (reference.dreamspell.constructor !== dreamspell)
      reference.dreamspell = new dreamspell(reference.dreamspell);
    var allDays = gregorian.from(reference.gregorian);
    var leapDays = daycount.counts.gregorian.countLeapDaysBetween(reference.gregorian, gregorian);
    return plusDays(reference.dreamspell, allDays - leapDays);
  };

  // Instance members:

  dreamspell.prototype.toString = function() {
    return (isNaN(this.month) ? 'x' : this.month)
      + '.' + (isNaN(this.dayOfMonth) ? 'x' : this.dayOfMonth)
      + '.' + (isNaN(this.kin) ? 'x' : this.kin)
  };

  function plusDays (dreamspell, days) {
    var dayOfYear = (dreamspell.dayOfYear + 365 + (days % 365)) % 365;
    var month = NaN;
    var dayOfMonth = NaN;
    if (dayOfYear != 0)
    {
      month = Math.ceil(dayOfYear / 28);
      dayOfMonth = dayOfYear - ((month - 1) * 28);
    }
    var kin = isNaN(dreamspell.kin) ? NaN : (dreamspell.kin + (days % 260) + 259) % 260 + 1;
    return new daycount.counts.dreamspell({
      month: month,
      dayOfMonth: dayOfMonth,
      kin: kin,
    });
  };

  return dreamspell;
})();
/**
 * Gregorian calendar system, as already implemented in system datetime libraries everywhere.
 */
daycount.counts.gregorian = (function() {

  var dayOfYear = [0,31,28,31,30,31,30,31,31,30,31,30,31];
  for(var i = 1; i < dayOfYear.length; ++i)
    dayOfYear[i] += dayOfYear[i-1];

  function gregorian(arg) {
    this.year = parseInt(arg && arg.year);
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    this.isLeapYear = (!(this.year % 4) && (this.year % 100) || !(this.year % 400)) != 0;
    this.isLeapDay = this.isLeapYear && (this.month == 2) && (this.dayOfMonth == 29);
    this.dayOfYear = dayOfYear[this.month - 1]
        + this.dayOfMonth
        + ((this.isLeapYear && this.month > 2) ? 1 : 0);
  };

  // Instance methods:

  // returns the number of days from the specified day to this day
  // e.g. {2012-12-21}.from({2012-12-01}) == 20
  gregorian.prototype.from = function (other) {
    var other = (other.constructor === gregorian)
      ? other : new gregorian(other);
    var leaps = gregorian.countLeapDaysBetween(
      new gregorian({year:this.year,month:1,dayOfMonth:1}),
      new gregorian({year:other.year,month:1,dayOfMonth:1}));
    return (this.year - other.year) * 365
      + this.dayOfYear - other.dayOfYear
      - leaps;
  };

  gregorian.prototype.plusDays = function (days) {
    // Set time of day to 12:00 to eliminate possible error due to time zone fluctuations:
    var system = new Date(this.year, this.month - 1, this.dayOfMonth + days, 12);
    return gregorian.from_Date(system);
  };

  gregorian.prototype.toString = function() {
    return this.year + '-' + this.month + '-' + this.dayOfMonth;
  };

  // Class methods:

  gregorian.countLeapDaysBetween = function (first, last) {
    first = (first.constructor === gregorian) ? first : new gregorian(first);
    last = (last.constructor === gregorian) ? last : new gregorian(last);
    first_leaps = Math.floor(first.year / 4) - Math.floor(first.year / 100) + Math.floor(first.year / 400);
    if (first.isLeapYear && first.month <= 2) first_leaps -= 1;
    last_leaps = Math.floor(last.year / 4) - Math.floor(last.year / 100) + Math.floor(last.year / 400);
    if (last.isLeapYear && last.month <= 2) last_leaps -= 1;
    return last_leaps - first_leaps;
  };

  gregorian.from_Date = function (system) {
    return new daycount.counts.gregorian({
      year: system.getFullYear(),
      month: system.getMonth() + 1,
      dayOfMonth: system.getDate(),
    });
  };

  return gregorian;
})();
/**
 * Julian day numbering system.
 */
daycount.counts.julianDay = (function() {

  function julianDay(arg) {
    if(typeof(arg) == 'object') arg = arg.number;
    this.number = parseInt(arg);
  };

  // Instance methods:

  julianDay.prototype.plus = function(days) {
    return new daycount.counts.julianDay(this.number + days);
  };

  julianDay.prototype.toString = function() {
    return this.number.toString();
  };

  // Class methods:

  julianDay.from_Date = function(system) {
    // from Wikipedia's Julian_day article:
    var a = parseInt((13 - system.getMonth()) / 12);
    var y = system.getFullYear() + 4800 - a;
    var m = system.getMonth() + (12 * a) - 2;
    var number = system.getDate() + Math.floor((153 * m + 2) / 5)
             + 365 * y + Math.floor(y / 4) - Math.floor(y / 100)
             + Math.floor(y / 400) - 32045;
    return new daycount.counts.julianDay({
      number: number,
    });
  };

  return julianDay;
})();
