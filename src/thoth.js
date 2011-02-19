daycount.counts.thoth = (function() {

  function thoth(arg) {
    this.venusYear = parseInt(arg && arg.venusYear);
    this.venusDayOfYear = parseInt(arg && arg.venusDayOfYear);
    this.venusMonth = parseInt((this.venusDayOfYear - 1) / 28) + 1;
    this.venusDayOfMonth = (this.venusDayOfYear - 1) % 28 + 1;
    this.venusWeek = parseInt((this.venusDayOfYear - 1) / 7) + 1;
    this.venusDayOfWeek = (this.venusDayOfYear - 1) % 7 + 1;
  };

  thoth.from_gregorian = function (gregorian) {
    var offset = gregorian.from(new daycount.counts.gregorian({year:2011,month:2,dayOfMonth:17}));
    var base = (7 * (32 * 7)) + 91;
    var actual = base + offset;
    var venusYear = parseInt(actual / (32 * 7)) + 1;
    var venusDayOfYear = actual % (32 * 7) + 1;
    return new daycount.counts.thoth({
      venusYear: venusYear,
      venusDayOfYear: venusDayOfYear,
    });
  };

  thoth.prototype.toString = function() {
    return 'VC:' + this.venusYear + '/' + this.venusDayOfYear
	+ ' (' + this.venusYear + ',' + this.venusWeek + ',' + this.venusDayOfWeek + ')';
  }

  return thoth;
})();
