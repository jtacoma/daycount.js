daycount.counts.venus = (function() {

  var start_jd = 2453951;

  function venus(arg) {
    this.year = parseInt(arg && arg.year);
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
    this.month = parseInt((this.dayOfYear - 1) / 28) + 1;
    this.dayOfMonth = (this.dayOfYear - 1) % 28 + 1;
    this.week = parseInt((this.dayOfYear - 1) / 7) + 1;
    this.dayOfWeek = (this.dayOfYear - 1) % 7 + 1;
  };

  venus.from_gregorian = function (gregorian) {
    var offset = gregorian.from(new daycount.counts.gregorian({year:2011,month:2,dayOfMonth:17}));
    var base = (7 * (32 * 7)) + 91;
    var actual = base + offset;
    var year = parseInt(actual / (32 * 7)) + 1;
    var dayOfYear = actual % (32 * 7) + 1;
    return new daycount.counts.venus({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  venus.prototype.toString = function() {
    return 'VC:' + this.year + '/' + this.dayOfYear
      + ' (' + this.year + ',' + this.week + ',' + this.dayOfWeek + ')';
  }

  return venus;
})();
