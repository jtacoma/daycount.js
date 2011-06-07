daycount.counts.gregorian = (function() {

  var dayOfYear = [0,31,28,31,30,31,30,31,31,30,31,30,31];
  for(var i = 1; i < dayOfYear.length; ++i)
    dayOfYear[i] += dayOfYear[i-1];
  var friday = {year:2012,month:12,dayOfMonth:21};

  function gregorian(arg) {
    this.year = parseInt(arg && arg.year);
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    this.isLeapYear =
      (!(this.year % 4) && (this.year % 100) || !(this.year % 400)) != 0;
    this.isLeapDay =
      this.isLeapYear && (this.month == 2) && (this.dayOfMonth == 29);
    this.dayOfYear = dayOfYear[this.month - 1]
      + this.dayOfMonth + ((this.isLeapYear && this.month > 2) ? 1 : 0);
    var a = Math.floor((14 - this.month) / 12);
    var y = this.year - a;
    var m = this.month + 12 * a - 2;
    this.dayOfWeek = ((this.dayOfMonth + y + Math.floor(y / 4)
      - Math.floor(y / 100) + Math.floor(y / 400) + Math.floor(31 * m / 12))
      % 7 + 7) % 7 + 1;
  };

  gregorian.prototype.countDaysSince = function (other) {
    var other = (other.constructor === gregorian)
      ? other : new gregorian(other);
    var leaps = new gregorian(
      { year: other.year, month: 1, dayOfMonth: 1 })
      .countLeapDaysSince(new gregorian(
        { year: this.year, month: 1, dayOfMonth: 1 }));
    return (this.year - other.year) * 365
      + this.dayOfYear - other.dayOfYear
      - leaps;
  };

  gregorian.prototype.countLeapDaysSince = function(other) {
    other = (other.constructor === gregorian)
      ? other : new gregorian(other);
    other_leaps = Math.floor(other.year / 4) - Math.floor(other.year / 100)
      + Math.floor(other.year / 400);
    if (other.isLeapYear && other.month <= 2)
      other_leaps -= 1;
    this_leaps = Math.floor(this.year / 4) - Math.floor(this.year / 100)
      + Math.floor(this.year / 400);
    if (this.isLeapYear && this.month <= 2)
      this_leaps -= 1;
    return this_leaps - other_leaps;
  }

  gregorian.prototype.dayOfWeekName = function() {
    return [null,
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
      "Saturday"
    ][this.dayOfWeek];
  };

  gregorian.prototype.monthName = function() {
    return [null,
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ][this.month];
  };

  gregorian.prototype.toString = function() {
    return this.year + '-'
      + (this.month >= 10 ? this.month : '0' + this.month) + '-'
      + (this.dayOfMonth >= 10 ? this.dayOfMonth : '0' + this.dayOfMonth);
  };

  // Class methods:

  gregorian.from_Date = function (system) {
    return new daycount.counts.gregorian({
      year: system.getFullYear(),
      month: system.getMonth() + 1,
      dayOfMonth: system.getDate(),
    });
  };

  gregorian.from_localJulianDay = function (localJulianDay) {
    // See Wikipedia's Julian_day#Gregorian_calendar_from_Julian_day_number
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
    var y = g * 400 + c * 100 + b * 4 + a;
    var m = Math.floor((Math.floor(da * 5) + 308) / 153) - 2;
    var d = da - Math.floor((m + 4) * 153 / 5) + 122;
    var Y = y - 4800 + Math.floor((m + 2) / 12);
    var M = (m + 2) % 12 + 1;
    var D = d + 1;
    return new daycount.counts.gregorian({
      year: Y, month: M, dayOfMonth: D,
    });
  };

  gregorian.from_String = function (string) {
    var match = (/(-?\d+)-(\d\d)-(\d\d)/).exec(string);
    if (!match) return null;
    var month = match[2][0] == '0' ? match[2][1] : match[2];
    var dayOfMonth = match[3][0] == '0' ? match[3][1] : match[3];
    return new daycount.counts.gregorian({
      year: parseInt(match[1]),
      month: parseInt(month),
      dayOfMonth: parseInt(dayOfMonth),
    });
  };

  return gregorian;
})();
