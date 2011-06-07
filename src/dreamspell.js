daycount.counts.dreamspell = (function () {

  function dreamspell (arg) {
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    this.dayOfYear = isNaN(this.month) ? 0
      : (this.month - 1) * 28 + this.dayOfMonth;
    this.kin = parseInt(arg && arg.kin);
  };

  var reference = {
    gregorian: new daycount.counts.gregorian(
      { year: 2012, month: 12, dayOfMonth: 21 }),
    dreamspell: { month: 6, dayOfMonth: 9, kin: 207 },
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
    var kin = isNaN(dreamspell.kin) ? NaN
      : (dreamspell.kin + (days % 260) + 259) % 260 + 1;
    return new daycount.counts.dreamspell({
      month: month,
      dayOfMonth: dayOfMonth,
      kin: kin,
    });
  };

  dreamspell.from_gregorian = function (gregorian) {
    if (reference.dreamspell.constructor !== dreamspell)
      reference.dreamspell = new dreamspell(reference.dreamspell);
    var allDays = gregorian.countDaysSince(reference.gregorian);
    var leapDays = gregorian.countLeapDaysSince(reference.gregorian);
    return plusDays(reference.dreamspell, allDays - leapDays);
  };

  dreamspell.localized = {};

  dreamspell.prototype.monthName = function() {
    return dreamspell.localized.monthNames[this.month - 1];
  };

  dreamspell.prototype.kinToneName = function() {
    return dreamspell.localized.kinToneNames[this.kin % 13];
  };

  dreamspell.prototype.kinSealName = function() {
    return dreamspell.localized.kinSealNames[this.kin % 20];
  };

  dreamspell.prototype.kinColorName = function() {
    return dreamspell.localized.kinColorNames[this.kin % 4];
  };

  dreamspell.prototype.toString = function() {
    return (isNaN(this.month) ? 'x' : this.month)
      + '.' + (isNaN(this.dayOfMonth) ? 'x' : this.dayOfMonth)
      + '.' + (isNaN(this.kin) ? 'x' : this.kin)
  };

  return dreamspell;
})();
