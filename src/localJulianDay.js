daycount.counts.localJulianDay = (function() {

  function localJulianDay(arg) {
    if(typeof(arg) == 'object') arg = arg.number;
    this.number = parseInt(arg);
  };

  // Instance methods:

  localJulianDay.prototype.plus = function(days) {
    return new daycount.counts.localJulianDay(this.number + days);
  };

  localJulianDay.prototype.toString = function() {
    return this.number.toString();
  };

  // Class methods:

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

  return localJulianDay;
})();
