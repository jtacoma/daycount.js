daycount.counts.mars = (function() {

  var start_jd = 2453690;

  function mars(arg) {
    this.year = parseInt(arg && arg.year);
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
    this.ascent = this.dayOfYear <= 300 ? this.dayOfYear : NaN;
    this.firstfour = 300 < this.dayOfYear && this.dayOfYear <= 340
      ? this.dayOfYear - 300 : NaN;
    this.firstthree = 340 < this.dayOfYear && this.dayOfYear <= 343
      ? this.dayOfYear - 340 : NaN;
    this.one = 343 < this.dayOfYear && this.dayOfYear <= 344
      ? this.dayOfYear - 343 : NaN;
    this.secondthree = 344 < this.dayOfYear && this.dayOfYear <= 347
      ? this.dayOfYear - 344 : NaN;
    this.secondfour = 347 < this.dayOfYear && this.dayOfYear <= 387
      ? this.dayOfYear - 347 : NaN;
    this.descent = 387 < this.dayOfYear ? this.dayOfYear - 387 : NaN;
  };

  mars.from_localJulianDay = function(localJulianDay) {
    var fixed = localJulianDay.number - start_jd;
    var year0 = Math.floor(fixed / 687);
    var dayOfYear = fixed - (year0 * 687) + 1;
    var year = (year0 >= 0) ? year0 + 1 : year0;
    return new daycount.counts.mars({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  mars.pattern = /[Mm][Cc]:?(-?[1-9]\d*)\/(\d+)/;

  mars.from_String = function(string) {
    var match = mars.pattern.exec(string);
    if (!match) return null;
    var year = parseInt(match[1]);
    var dayOfYear = parseInt(match[2]);
    return new mars({year:year,dayOfYear:dayOfYear});
  };

  mars.prototype.toString = function() {
    return 'MC:' + (this.year || 'x') + '/' + this.dayOfYear +
      ' (' + (this.year || 'x') + ':' +
         (this.ascent ? this.ascent : 'x/' +
          (this.firstfour ? this.firstfour : 'x/' +
           (this.firstthree ? this.firstthree : 'x/' +
            (this.one ? this.one : 'x/' +
             (this.secondthree ? this.secondthree : 'x/' +
              (this.secondfour ? this.secondfour : 'x/' +
               this.descent)))))) + ')';
  }

  return mars;
})();
