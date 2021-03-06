daycount.counts.localJulianDay = (function() {

  function localJulianDay(arg) {
    if(typeof(arg) == 'object') arg = parseInt(arg && arg.number);
    this.number = parseInt(arg);
  };

  localJulianDay.prototype.plus = function(days) {
    return new daycount.counts.localJulianDay(this.number + days);
  };

  localJulianDay.prototype.toString = function() {
    return this.number.toString();
  };

  // Conversions.  Local Julian Day is the most normalized count, being just
  // one integer to uniquely represent any day.  So it makes sense to convert
  // between most counts via this one.

  localJulianDay.from_Date = function(system) {
    // from Wikipedia's Julian_day article:
    var a = parseInt((13 - system.getMonth()) / 12);
    var y = system.getFullYear() + 4800 - a;
    var m = system.getMonth() + (12 * a) - 2;
    var number = system.getDate() + Math.floor((153 * m + 2) / 5)
             + 365 * y + Math.floor(y / 4) - Math.floor(y / 100)
             + Math.floor(y / 400) - 32045;
    return new daycount.counts.localJulianDay({
      number: number,
    });
  };

  localJulianDay.from_gregorian = function(gregorian) {
    // from Wikipedia's Julian_day article:
    var a = parseInt((14 - gregorian.month) / 12);
    var y = gregorian.year + 4800 - a;
    var m = gregorian.month + (12 * a) - 3;
    var number = gregorian.dayOfMonth + Math.floor((153 * m + 2) / 5)
             + 365 * y + Math.floor(y / 4) - Math.floor(y / 100)
             + Math.floor(y / 400) - 32045;
    return new daycount.counts.localJulianDay({
      number: number,
    });
  };

  localJulianDay.from_long = function(long) {
    var number = 584283 + long.kin + 20 * long.winal + 360 * long.tun
      + 7200 * long.katun + 144000 * long.baktun;
    return new daycount.counts.localJulianDay(number);
  };

  localJulianDay.from_venus = function(venus) {
    var year0 = venus.year > 0 ? venus.year - 1 : venus.year;
    var offset = year0 * 224
      + Math.floor(year0 / 10) * 7
      + venus.dayOfYear - 1;
    return new daycount.counts.localJulianDay(2453951 + offset);
  };

  localJulianDay.from_mars = function(mars) {
    var offset = (mars.year > 0 ? mars.year - 1 : mars.year) * 687 + mars.dayOfYear - 1;
    return new daycount.counts.localJulianDay(2453690 + offset);
  };

  localJulianDay.from_thoth = function(thoth) {
    var offset = (thoth.year > 0 ? thoth.year - 1 : thoth.year) * 88 + thoth.dayOfYear - 1;
    return new daycount.counts.localJulianDay(2452993 + offset);
  };

  localJulianDay.from_String = function(string) {
    var match = (/[Ll][Jj][Dd]:(\d+)/).exec(string);
    if (!match) return null;
    return new daycount.counts.localJulianDay(parseInt(match[1]));
  };

  return localJulianDay;
})();
