// Dates in the Chinese calendar are difficult to calculate without certain
// hard-to-find information.  For now, this algorithm calculates only the year,
// and only for dates when such a simple algorithm is reliable.  For other
// dates, it will determine 'stem' and 'branch' numbers as NaN.
// TODO: Find the necessary information and replace this algorithm with
// something more complete.
daycount.counts.chineseYear = (function() {
  function chineseYear (arg) {
    this.stem = parseInt(arg && arg.stem);
    this.branch = parseInt(arg && arg.branch);
  }
  chineseYear.prototype.toString = function() {
    return (this.stem || '?') + '/' + (this.branch || '?');
  };
  chineseYear.from_gregorian = function(gregorian) {
    if (gregorian.month <= 2)
      return new chineseYear({stem:NaN,branch:NaN});
    var year0 = ((gregorian.year - 2044 % 60) + 60) % 60;
    var stem = (year0 % 10) + 1;
    var branch = (year0 % 12) + 1;
    return new chineseYear({stem:stem,branch:branch});
  };
  return chineseYear;
})();
