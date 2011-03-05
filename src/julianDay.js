daycount.counts.julianDay = (function() {

  function julianDay(arg) {
    if(typeof(arg) == 'object') arg = arg.number;
    this.number = parseInt(arg);
  };

  julianDay.prototype.toString = function() {
    return this.number.toString();
  };

  julianDay.from_Date = function(system) {
    // from Wikipedia's Julian_day article:
    var a = parseInt((13 - system.getUTCMonth()) / 12);
    var y = system.getUTCFullYear() + 4800 - a;
    var m = system.getUTCMonth() + (12 * a) - 2;
    var number = system.getUTCDate() + Math.floor((153 * m + 2) / 5)
             + 365 * y + Math.floor(y / 4) - Math.floor(y / 100)
             + Math.floor(y / 400) - 32045;
    return new daycount.counts.julianDay({
      number: number,
    });
  };

  return julianDay;
})();
