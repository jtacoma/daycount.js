daycount.counts.long = (function() {

  var start_jd = 584283;

  function long(arg) {
    this.baktun = parseInt(arg && arg.baktun);
    this.katun = parseInt(arg && arg.katun);
    this.tun = parseInt(arg && arg.tun);
    this.winal = parseInt(arg && arg.winal);
    this.kin = parseInt(arg && arg.kin);
  };

  long.prototype.toString = function() {
    return this.baktun + '.' + this.katun + '.' + this.tun +
      '.' + this.winal + '.' + this.kin;
  };

  long.pattern = /(\d+)\.(\d+)\.(\d+)\.(\d+)\.(\d+)/;

  long.from_localJulianDay = function(localJulianDay) {
    var days = localJulianDay.number - start_jd;
    var kin = days % 20;
    var winal = Math.floor(((days - kin) % 360) / 20);
    var tun = Math.floor(((days - kin - winal * 20) % 7200) / 360);
    var katun = Math.floor(
      ((days - kin - winal * 20 - tun * 360) % 144000) / 7200);
    var baktun = Math.floor(
      ((days - kin - winal * 20 - tun * 360 - katun * 7200) % (20 * 144000))
      / 144000);
    return new daycount.counts.long({
      baktun: baktun,
      katun: katun,
      tun: tun,
      winal: winal,
      kin: kin,
    });
  };

  long.from_String = function(string) {
    var match = (long.pattern).exec(string);
    if (!match) return null;
    return new daycount.counts.long({
      baktun: parseInt(match[1]),
      katun: parseInt(match[2]),
      tun: parseInt(match[3]),
      winal: parseInt(match[4]),
      kin: parseInt(match[5]),
    });
  };

  return long;
})();
