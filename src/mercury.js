daycount.counts.mercury = (function() {

  var start_jd = 2453690;

  function mercury(arg) {
    this.year = parseInt(arg && arg.year);
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
  };

  mercury.from_localJulianDay = function(localJulianDay) {
    var fixed = localJulianDay.number - start_jd;
    var year0 = Math.floor(fixed / 687);
    var dayOfYear = fixed - (year0 * 687) + 1;
    var year = (year0 >= 0) ? year0 + 1 : NaN;
    return new daycount.counts.mercury({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  mercury.prototype.toString = function() {
    return 'MC:' + (this.year || 'x') + '/' + this.dayOfYear;
  }

  return mercury;
})();
