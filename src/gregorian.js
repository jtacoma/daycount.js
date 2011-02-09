/**
 * Gregorian calendar system, as already implemented in system datetime libraries everywhere.
 */
calendars.counts.gregorian = (function() {

  function gregorian(arg) {
    this.year = parseInt(arg && arg.year);
    this.month = parseInt(arg && arg.month);
    this.date = parseInt(arg && arg.date);
    this.isLeapYear = (!(this.year % 4) && (this.year % 100) || !(this.year % 400)) != 0;
  };

  // Instance methods:

  function plus(days) {
    // Set time of day to 12:00 to eliminate possible error due to time zone fluctuations:
    var system = new Date(this.year, this.month - 1, this.date + days, 12);
    return gregorian.from_Date(system);
  };
  gregorian.prototype.plus = plus;

  // Class methods:

  function from_Date(system) {
    return new calendars.counts.gregorian({
      year: system.getFullYear(),
      month: system.getMonth() + 1,
      date: system.getDate(),
    });
  };
  gregorian.from_Date = from_Date;

  return gregorian;
})();
