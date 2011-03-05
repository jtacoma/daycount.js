daycount.counts.dreamspell = (function () {

  function dreamspell (arg) {
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    this.dayOfYear = isNaN(this.month) ? 0
      : (this.month - 1) * 28 + this.dayOfMonth;
    this.kin = parseInt(arg && arg.kin);
  };

  dreamspell.prototype.monthName = function() {
    return [null,
      "Magnetic", "Lunar", "Electric", "Self-Existing", "Overtone", "Rhythmic",
      "Resonant", "Galactic", "Solar", "Spectral", "Planetary", "Crystal",
      "Cosmic"
    ][this.month];
  };

  dreamspell.prototype.kinToneName = function() {
    return [
      "Cosmic",
      "Magnetic", "Lunar", "Electric", "Self-Existing", "Overtone", "Rhythmic",
      "Resonant", "Galactic", "Solar", "Spectral", "Planetary", "Crystal"
    ][this.kin % 13];
  };

  dreamspell.prototype.kinSealName = function() {
    return [
      "Sun", "Dragon", "Wind", "Night", "Seed", "Serpent", "World-Bridger",
      "Hand", "Star", "Moon", "Dog", "Monkey", "Human", "Skywalker", "Wizard",
      "Eagle", "Warrior", "Earth", "Mirror", "Storm"
    ][this.kin % 20];
  };

  dreamspell.prototype.kinColorName = function() {
    return [
      "Yellow", "Red", "White", "Blue"
    ][this.kin % 4];
  };

  dreamspell.prototype.toString = function() {
    return (isNaN(this.month) ? 'x' : this.month)
      + '.' + (isNaN(this.dayOfMonth) ? 'x' : this.dayOfMonth)
      + '.' + (isNaN(this.kin) ? 'x' : this.kin)
  };

  var reference = {
    gregorian: new daycount.counts.gregorian({year:2012, month:12, dayOfMonth:21}),
    dreamspell: {month:6, dayOfMonth:9, kin:207},
  };

  dreamspell.from_gregorian = function (gregorian) {
    if (reference.dreamspell.constructor !== dreamspell)
      reference.dreamspell = new dreamspell(reference.dreamspell);
    var allDays = gregorian.countDaysSince(reference.gregorian);
    var leapDays = gregorian.countLeapDaysSince(reference.gregorian);
    return plusDays(reference.dreamspell, allDays - leapDays);
  };

  function plusDays (dreamspell, days) {
    var dayOfYear = (dreamspell.dayOfYear + 365 + (days % 365)) % 365;
    var month = NaN;
    var dayOfMonth = NaN;
    if (dayOfYear != 0)
    {
      month = Math.ceil(dayOfYear / 28);
      dayOfMonth = dayOfYear - ((month - 1) * 28);
    }
    var kin = isNaN(dreamspell.kin) ? NaN : (dreamspell.kin + (days % 260) + 259) % 260 + 1;
    return new daycount.counts.dreamspell({
      month: month,
      dayOfMonth: dayOfMonth,
      kin: kin,
    });
  };

  return dreamspell;
})();
