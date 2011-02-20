daycount.counts.thoth = (function() {

  var start_jd = 2452993;

  function thoth(arg) {
    this.year = parseInt(arg && arg.year);
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
  };

  thoth.from_localJulianDay = function(localJulianDay) {
    var fixed = localJulianDay.number - start_jd;
    var year0 = Math.floor(fixed / 88);
    var dayOfYear = fixed - (year0 * 88) + 1;
    var year = (year0 >= 0) ? year0 + 1 : NaN;
    return new daycount.counts.thoth({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  thoth.prototype.toString = function() {
    return 'TC:' + (this.year || 'x') + '/' + this.dayOfYear;
  }

  return thoth;
})();
