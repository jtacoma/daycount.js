daycount.counts.bahai = (function() {

  var epoch_jd = 2394647; // 1844-03-21

  function bahai(arg) {
    this.major = parseInt(arg && arg.major);
    this.cycle = parseInt(arg && arg.cycle);
    this.year = parseInt(arg && arg.year);
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    //this.dayOfWeek = ?
  };

  bahai.prototype.toString = function() {
    return this.major + '-' + this.cycle + '-' + this.year +
      '-' + this.month + '-' + this.dayOfMonth;
  };

  bahai.pattern = /(\d+)\-(\d+)\-(\d+)\-(\d+)\-(\d+)/;

  bahai.from_localJulianDay = function(localJulianDay) {
    var days = localJulianDay.number - epoch_jd;
    return new daycount.counts.bahai({
      major: NaN,
      cycle: NaN,
      year: NaN,
      month: NaN,
      dayOfMonth: NaN,
    });
  };

  bahai.from_String = function(string) {
    var match = (bahai.pattern).exec(string);
    if (!match) return null;
    return new daycount.counts.bahai({
      major: parseInt(match[1]),
      cycle: parseInt(match[2]),
      year: parseInt(match[3]),
      month: parseInt(match[4]),
      dayOfMonth: parseInt(match[5]),
    });
  };

  return bahai;
})();
