daycount.counts.badi = (function() {

  var epoch_jd = 2394647; // 1844-03-21

  function badi(arg) {
    this.major = parseInt(arg && arg.major);
    this.cycle = parseInt(arg && arg.cycle);
    this.year = parseInt(arg && arg.year);
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
    this.isLeapYear = parseInt(arg && arg.isLeapYear);
    var intercalaryStart = 336;
    var intercalaryEnd = 336 + (this.isLeapYear ? 6 : 5);
    this.isIntercalary = intercalaryStart <= this.dayOfYear 
                      && this.dayOfYear < intercalaryEnd;
    this.month = this.isIntercalary ? NaN
      : (this.dayOfYear >= intercalaryEnd) ? 19
      : Math.floor((this.dayOfYear - 1) / 19) + 1;
    this.dayOfMonth = this.isIntercalary ? NaN
      : (this.isLeapYear && this.month == 19)
      ? this.dayOfYear - intercalaryEnd
      : (this.dayOfYear - 1) % 19 + 1;
    //this.dayOfWeek = ?
  };

  badi.prototype.toString = function() {
    return this.major + ':' + this.cycle + ':' + this.year +
      ':' + this.dayOfYear;
  };

  badi.from_gregorian = function(gregorian) {
    var isLeapYear = gregorian.isLeapYear
      ? (gregorian.month < 3 ||
         (gregorian.month == 3 && gregorian.dayOfMonth < 21))
      : new daycount.counts.gregorian(
          { year: gregorian.year + 1, month: 1, dayOfMonth: 1}).isLeapYear;
    var dayOfYear = gregorian.countDaysSince(
        { year: gregorian.year, month: 3, dayOfMonth: 20});
    if (dayOfYear <= 0) dayOfYear += isLeapYear ? 366 : 365;
    var year = gregorian.year - ((dayOfYear > 286) ? 1845 : 1844);
    if (year >= 0) year += 1;
    var major = Math.floor((year - 1) / (19 * 19));
    if (major >= 0) major += 1;
    var cycle = Math.floor((year - 1) / 19);
    if (cycle >= 0) cycle += 1;
    return new daycount.counts.badi({
      major: major,
      cycle: cycle,
      year: year,
      dayOfYear: dayOfYear,
      isLeapYear: isLeapYear,
    });
  };

  badi.pattern = /(\d+):(\d+):(\d+):(\d+)/;

  badi.from_String = function(string) {
    var match = (badi.pattern).exec(string);
    if (!match) return null;
    return new daycount.counts.badi({
      major: parseInt(match[1]),
      cycle: parseInt(match[2]),
      year: parseInt(match[3]),
      dayOfYear: parseInt(match[4]),
    });
  };

  return badi;
})();
