daycount.counts.venus = (function() {

  var start_jd = 2453951;

  function venus(arg) {
    this.year = parseInt(arg && arg.year);
    this.yearOfDecade = (this.year > 0) ? (this.year - 1) % 10 + 1 : this.year % 10 + 11;
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
    this.month = Math.floor((this.dayOfYear - 1) / 28) + 1;
    this.dayOfMonth = (this.dayOfYear - 1) % 28 + 1;
    this.week = (this.year ? Math.floor((this.dayOfYear - 1) / 7) + 1 : NaN);
    this.dayOfWeek = (this.dayOfYear - 1) % 7 + 1;
  };

  venus.from_localJulianDay = function(localJulianDay) {
    var fixed = localJulianDay.number - start_jd;
    var decade0 = Math.floor(fixed / 2247);
    var dayOfDecade = fixed - (decade0 * 2247);
    var yearOfDecade = Math.floor(dayOfDecade / 224) + 1;
    var dayOfYear = dayOfDecade % 224 + 1;
    if (yearOfDecade == 11) { yearOfDecade -= 1; dayOfYear += 224; }
    var year = decade0 * 11 + yearOfDecade;
    //if (year >= 0) year += 1;
    return new daycount.counts.venus({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  venus.pattern = /[Vv][Cc]:?(-?[1-9]\d*)\/(\d+)(\+[1-7])?/;

  venus.from_String = function(string) {
    var match = venus.pattern.exec(string);
    if (!match) return null;
    var year = parseInt(match[1]);
    var dayOfYear = parseInt(match[2]) + (match[3] ? parseInt(match[3]) : 0);
    return new venus({year:year,dayOfYear:dayOfYear});
  };

  venus.prototype.toString = function() {
    return 'VC:' + (this.year || 'x') + '/'
      + (this.dayOfYear <= 224 ? this.dayOfYear : '224+' + this.dayOfWeek)
      + ' (' + (this.dayOfYear <= 224
        ? (this.yearOfDecade + ',' + (this.week || 'x') + ',' + this.dayOfWeek)
        : ('\u221E,' + this.dayOfWeek))
      + ')';
  }

  return venus;
})();
