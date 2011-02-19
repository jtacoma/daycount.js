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
    return this.year + '-'
      + (this.month >= 10 ? this.month : '0' + this.month) + '-'
      + (this.dayOfMonth >= 10 ? this.dayOfMonth : '0' + this.dayOfMonth);
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

  gregorian.from_localJulianDay = function (localJulianDay) {
    // From Wikipedia's Julian_day article:
    var J = localJulianDay.number + 0.5;
    var j = J + 32044;
    var g = Math.floor(j / 146097);
    var dg = Math.floor(j) % 146097;
    var c = Math.floor((Math.floor(dg / 36524) + 1) * 3 / 4);
    var dc = dg - c * 36524;
    var b = Math.floor(dc / 1461);
    var db = dc % 1461;
    var a = Math.floor((Math.floor(db / 365) + 1) * 3 / 4);
    var da = db - a * 365;
    var y = g * 400 + c * 100 + b * 4 + a; // number of full years elapsed since March 1, 4801 BC at 00:00 UTC);
    var m = Math.floor((Math.floor(da * 5) + 308) / 153) - 2; // number of full months elapsed since the last March 1 at 00:00 UTC);
    var d = da - Math.floor((m + 4) * 153 / 5) + 122; // number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day);
    var Y = y - 4800 + Math.floor((m + 2) / 12);
    var M = (m + 2) % 12 + 1;
    var D = d + 1;
    return new daycount.counts.gregorian({
      year: Y, month: M, dayOfMonth: D,
    });
  };

  return gregorian;
})();
