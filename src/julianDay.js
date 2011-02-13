/**
 * Julian day numbering system.
 */
daycount.counts.julianDay = (function() {

  function julianDay(arg) {
    if(typeof(arg) == 'object') arg = arg.number;
    this.number = parseInt(arg);
  };

  // Instance methods:

  julianDay.prototype.plus = function(days) {
    return new daycount.counts.julianDay(this.number + days);
  };

  julianDay.prototype.toString = function() {
    return this.number.toString();
  };

  // Class methods:

  julianDay.from_Date = function(system) {
    // from Wikipedia's Julian_day article:
    var a = parseInt((13 - system.getMonth()) / 12);
    var y = system.getFullYear() + 4800 - a;
    var m = system.getMonth() + (12 * a) - 2;
    var number = system.getDate() + Math.floor((153 * m + 2) / 5)
             + 365 * y + Math.floor(y / 4) - Math.floor(y / 100)
             + Math.floor(y / 400) - 32045;
    return new daycount.counts.julianDay({
      number: number,
    });
  };

  return julianDay;
})();
