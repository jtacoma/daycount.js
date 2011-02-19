daycount.counts.venus = (function() {

  var start_jd = 2453951;

  function venus(arg) {
    this.year = parseInt(arg && arg.year);
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
    this.month = parseInt((this.dayOfYear - 1) / 28) + 1;
    this.dayOfMonth = (this.dayOfYear - 1) % 28 + 1;
    this.week = (this.year ? parseInt((this.dayOfYear - 1) / 7) + 1 : NaN);
    this.dayOfWeek = (this.dayOfYear - 1) % 7 + 1;
  };

  venus.from_localJulianDay = function(localJulianDay) {
    var fixed = localJulianDay.number - start_jd;
    var decade0 = Math.floor(fixed / 2247);
    var dayOfDecade = fixed - (decade0 * 2247);
    var year = Math.floor(dayOfDecade / 224) + 1;
    var dayOfYear = dayOfDecade % 224 + 1;
    if (year == 11) year = NaN;
    return new daycount.counts.venus({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  venus.prototype.toString = function() {
    return 'VC:' + (this.year || 'x') + '/' + this.dayOfYear
      + ' (' + (this.year || 'x') + ',' + (this.week || 'x') + ',' + this.dayOfWeek + ')';
  }

  return venus;
})();
