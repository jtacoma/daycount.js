/*
 * daycount.js v0.1.2
 * http://yellowseed.org/daycount.js/
 *
 * Copyright 2011, Joshua Tacoma
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

// All other globals defined here are kept in this object:
var daycount = (typeof exports !== 'undefined' && exports !== null) ? exports : {};

// The 'moment' type, which may include associated information from any calendar system:
daycount.moment = (function() {

  // 'moment' constructor:
  function moment(arg) {
    this.set(arg);
  };

  moment.prototype.set = function(arg) {
    if(!arg || arg === null)
      arg = new Date();

    // Now, we're going to calculate as many counts as possible...

    // 'todo' lists counts to be calculated:
    var todo = []
    for(var name in daycount.counts)
    {
      todo.push(name);
      // wipe out any counts lingering from previous calculations:
      if(name in this)
        delete this[name];
    }

    // 'done' lists known counts:
    var done = [arg.constructor.name];
    // TODO: make sure that no item in 'done' is also in 'todo'.

    if (!(arg.constructor.name in daycount.counts))
      this.isUnknown = true;

    // Store argument as the only known property of this:
    this[arg.constructor.name] = arg;

    // Iterate through counts in 'done'.  We're going to add to this list as we
    // go, which makes this for loop a little more interesting:
    for (var indexDone = 0; indexDone < done.length && todo.length > 0; ++indexDone) {
      var nameDone = done[indexDone];
      var builderNameTodo = 'from_' + nameDone;

      // Iterate through counts in 'todo'.  Since we're going to remove
      // them as we go, iterate backwards to keep remaining indices
      // from shifting:
      for (var indexTodo = todo.length - 1; indexTodo >= 0; --indexTodo) {
        var nameTodo = todo[indexTodo];
        var countTodo = daycount.counts[nameTodo];

        if(!countTodo.hasOwnProperty(builderNameTodo)) continue;

        // Found one!  Calculate the value for 'countTodo':
        var builder = countTodo[builderNameTodo];
        var built = builder(this[nameDone]);
        if(built === null) continue;

        this[nameTodo] = built;
        done.push(nameTodo);
        todo.splice(indexTodo, 1)
        if('isUnknown' in this)
          delete this['isUnknown'];
      }
    }
  };

  moment.prototype.plusEarthSolarDays = function(days) {
    if('localJulianDay' in this)
      return new moment(new daycount.counts.localJulianDay(this.localJulianDay.number + days));
    else
      throw 'this moment has no counts that support the specified increment.';
  };

  moment.prototype.plus = moment.prototype.plusEarthSolarDays;

  return moment;
})();

// A collection of counts i.e. calendar systems.
// Each calendar system should be added to this object.
daycount.counts = {};

daycount.version_ = {
  major: 0,
  minor: 1,
  build: 2,
};

daycount.counts.dreamspell = (function () {

  function dreamspell (arg) {
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    this.dayOfYear = isNaN(this.month) ? 0
      : (this.month - 1) * 28 + this.dayOfMonth;
    this.kin = parseInt(arg && arg.kin);
  };

  // Static members:

  var reference = {
    gregorian: {year:2012, month:12, dayOfMonth:21},
    dreamspell: {month:6, dayOfMonth:9, kin:207},
  };

  dreamspell.from_gregorian = function (gregorian) {
    if (reference.dreamspell.constructor !== dreamspell)
      reference.dreamspell = new dreamspell(reference.dreamspell);
    var allDays = gregorian.from(reference.gregorian);
    var leapDays = daycount.counts.gregorian.countLeapDaysBetween(reference.gregorian, gregorian);
    return plusDays(reference.dreamspell, allDays - leapDays);
  };

  // Instance members:

  dreamspell.prototype.toString = function() {
    return (isNaN(this.month) ? 'x' : this.month)
      + '.' + (isNaN(this.dayOfMonth) ? 'x' : this.dayOfMonth)
      + '.' + (isNaN(this.kin) ? 'x' : this.kin)
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
/**
 * Gregorian calendar system, as already implemented in system datetime libraries everywhere.
 */
daycount.counts.gregorian = (function() {

  var dayOfYear = [0,31,28,31,30,31,30,31,31,30,31,30,31];
  for(var i = 1; i < dayOfYear.length; ++i)
    dayOfYear[i] += dayOfYear[i-1];

  function gregorian(arg) {
    this.year = parseInt(arg && arg.year);
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    this.isLeapYear = (!(this.year % 4) && (this.year % 100) || !(this.year % 400)) != 0;
    this.isLeapDay = this.isLeapYear && (this.month == 2) && (this.dayOfMonth == 29);
    this.dayOfYear = dayOfYear[this.month - 1]
        + this.dayOfMonth
        + ((this.isLeapYear && this.month > 2) ? 1 : 0);
  };

  // Instance methods:

  // returns the number of days from the specified day to this day
  // e.g. {2012-12-21}.from({2012-12-01}) == 20
  gregorian.prototype.from = function (other) {
    var other = (other.constructor === gregorian)
      ? other : new gregorian(other);
    var leaps = gregorian.countLeapDaysBetween(
      new gregorian({year:this.year,month:1,dayOfMonth:1}),
      new gregorian({year:other.year,month:1,dayOfMonth:1}));
    return (this.year - other.year) * 365
      + this.dayOfYear - other.dayOfYear
      - leaps;
  };

  gregorian.prototype.plusDays = function (days) {
    // Set time of day to 12:00 to eliminate possible error due to time zone fluctuations:
    var system = new Date(this.year, this.month - 1, this.dayOfMonth + days, 12);
    return gregorian.from_Date(system);
  };

  gregorian.prototype.toString = function() {
    return this.year + '-'
      + (this.month >= 10 ? this.month : '0' + this.month) + '-'
      + (this.dayOfMonth >= 10 ? this.dayOfMonth : '0' + this.dayOfMonth);
  };

  // Class methods:

  gregorian.countLeapDaysBetween = function (first, last) {
    first = (first.constructor === gregorian) ? first : new gregorian(first);
    last = (last.constructor === gregorian) ? last : new gregorian(last);
    first_leaps = Math.floor(first.year / 4) - Math.floor(first.year / 100) + Math.floor(first.year / 400);
    if (first.isLeapYear && first.month <= 2) first_leaps -= 1;
    last_leaps = Math.floor(last.year / 4) - Math.floor(last.year / 100) + Math.floor(last.year / 400);
    if (last.isLeapYear && last.month <= 2) last_leaps -= 1;
    return last_leaps - first_leaps;
  };

  gregorian.from_Date = function (system) {
    return new daycount.counts.gregorian({
      year: system.getFullYear(),
      month: system.getMonth() + 1,
      dayOfMonth: system.getDate(),
    });
  };

  gregorian.from_localJulianDay = function (localJulianDay) {
    // From Wikipedia's Julian_day article:
    var J = localJulianDay.number + 0.5;
    var j = J + 32044;
    var g = Math.floor(j / 146097);
    var dg = Math.floor(j) % 146097;
    var c = Math.floor((Math.floor(dg / 36524) + 1) * 3 / 4);
    var dc = dg - c * 36524;
    var b = Math.floor(dc / 1461);
    var db = dc % 1461;
    var a = Math.floor((Math.floor(db / 365) + 1) * 3 / 4);
    var da = db - a * 365;
    var y = g * 400 + c * 100 + b * 4 + a; // number of full years elapsed since March 1, 4801 BC at 00:00 UTC);
    var m = Math.floor((Math.floor(da * 5) + 308) / 153) - 2; // number of full months elapsed since the last March 1 at 00:00 UTC);
    var d = da - Math.floor((m + 4) * 153 / 5) + 122; // number of days elapsed since day 1 of the month at 00:00 UTC, including fractions of one day);
    var Y = y - 4800 + Math.floor((m + 2) / 12);
    var M = (m + 2) % 12 + 1;
    var D = d + 1;
    return new daycount.counts.gregorian({
      year: Y, month: M, dayOfMonth: D,
    });
  };

  gregorian.from_String = function (string) {
    var match = (/(-?\d+)-(\d\d)-(\d\d)/).exec(string);
    if (!match) return null;
    var month = match[2][0] == '0' ? match[2][1] : match[2];
    var dayOfMonth = match[3][0] == '0' ? match[3][1] : match[3];
    return new daycount.counts.gregorian({
      year: parseInt(match[1]),
      month: parseInt(month),
      dayOfMonth: parseInt(dayOfMonth),
    });
  };

  return gregorian;
})();
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
daycount.counts.localJulianDay = (function() {

  function localJulianDay(arg) {
    if(typeof(arg) == 'object') arg = parseInt(arg && arg.number);
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

  localJulianDay.from_long = function(long) {
    var number = 584283 + long.kin + 20 * long.winal + 360 * long.tun
      + 7200 * long.katun + 144000 * long.baktun;
    return new daycount.counts.localJulianDay(number);
  };

  localJulianDay.from_String = function(string) {
    var match = (/[Ll][Jj][Dd]:(\d+)/).exec(string);
    if (!match) return null;
    return new daycount.counts.localJulianDay(parseInt(match[1]));
  };

  return localJulianDay;
})();
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
    return this.baktun + '.' + this.katun + '.' + this.tun + '.' + this.winal + '.' + this.kin;
  };

  long.pattern = /(\d+)\.(\d+)\.(\d+)\.(\d+)\.(\d+)/;

  long.from_localJulianDay = function(localJulianDay) {
    var days = localJulianDay.number - start_jd;
    var kin = days % 20;
    var winal = Math.floor(((days - kin) % 360) / 20);
    var tun = Math.floor(((days - kin - winal * 20) % 7200) / 360);
    var katun = Math.floor(((days - kin - winal * 20 - tun * 360) % 144000) / 7200);
    var baktun = Math.floor(((days - kin - winal * 20 - tun * 360 - katun * 7200) % (20 * 144000)) / 144000);
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
daycount.counts.mars = (function() {

  var start_jd = 2453690;

  function mars(arg) {
    this.year = parseInt(arg && arg.year);
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
    this.ascent = this.dayOfYear <= 300 ? this.dayOfYear : NaN;
    this.firstfour = 300 < this.dayOfYear && this.dayOfYear <= 340 ? this.dayOfYear - 300 : NaN;
    this.firstthree = 340 < this.dayOfYear && this.dayOfYear <= 343 ? this.dayOfYear - 340 : NaN;
    this.one = 343 < this.dayOfYear && this.dayOfYear <= 344 ? this.dayOfYear - 343 : NaN;
    this.secondthree = 344 < this.dayOfYear && this.dayOfYear <= 347 ? this.dayOfYear - 344 : NaN;
    this.secondfour = 347 < this.dayOfYear && this.dayOfYear <= 387 ? this.dayOfYear - 347 : NaN;
    this.descent = 387 < this.dayOfYear ? this.dayOfYear - 387 : NaN;
  };

  mars.from_localJulianDay = function(localJulianDay) {
    var fixed = localJulianDay.number - start_jd;
    var year0 = Math.floor(fixed / 687);
    var dayOfYear = fixed - (year0 * 687) + 1;
    var year = (year0 >= 0) ? year0 + 1 : year0;
    return new daycount.counts.mars({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  mars.pattern = /[Mm][Cc]:?(-?[1-9]\d*)\/(\d+)/;

  mars.from_String = function(string) {
    var match = mars.pattern.exec(string);
    if (!match) return null;
    var year = parseInt(match[1]);
    var dayOfYear = parseInt(match[2]);
    return new mars({year:year,dayOfYear:dayOfYear});
  };

  mars.prototype.toString = function() {
    return 'MC:' + (this.year || 'x') + '/' + this.dayOfYear +
      ' (' + (this.year || 'x') + ':' +
         (this.ascent ? this.ascent : 'x/' +
          (this.firstfour ? this.firstfour : 'x/' +
           (this.firstthree ? this.firstthree : 'x/' +
            (this.one ? this.one : 'x/' +
             (this.secondthree ? this.secondthree : 'x/' +
              (this.secondfour ? this.secondfour : 'x/' +
               this.descent)))))) + ')';
  }

  return mars;
})();
daycount.counts.thoth = (function() {

  var start_jd = 2452993;

  function thoth(arg) {
    this.year = parseInt(arg && arg.year);
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
  };

  thoth.from_localJulianDay = function(localJulianDay) {
    var fixed = localJulianDay.number - start_jd;
    var year0 = Math.floor(fixed / 88);
    var dayOfYear = fixed - (year0 * 88) + 1;
    var year = (year0 >= 0) ? year0 + 1 : year0;
    return new daycount.counts.thoth({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  thoth.pattern = /[Tt][Cc]:?(-?[1-9]\d*)\/(\d+)/;

  thoth.from_String = function(string) {
    var match = thoth.pattern.exec(string);
    if (!match) return null;
    var year = parseInt(match[1]);
    var dayOfYear = parseInt(match[2]);
    return new thoth({year:year,dayOfYear:dayOfYear});
  };

  thoth.prototype.toString = function() {
    return 'TC:' + this.year + '/' + this.dayOfYear;
  }

  return thoth;
})();
daycount.counts.venus = (function() {

  var start_jd = 2453951;

  function venus(arg) {
    this.year = parseInt(arg && arg.year);
    this.yearOfDecade = (this.year > 0) ? (this.year - 1) % 10 + 1 : this.year % 10 + 11;
    this.dayOfYear = parseInt(arg && arg.dayOfYear);
    this.month = Math.floor((this.dayOfYear - 1) / 28) + 1;
    this.dayOfMonth = (this.dayOfYear - 1) % 28 + 1;
    this.week = (this.year ? Math.floor((this.dayOfYear - 1) / 7) + 1 : NaN);
    this.dayOfWeek = (this.dayOfYear - 1) % 7 + 1;
  };

  venus.from_localJulianDay = function(localJulianDay) {
    var fixed = localJulianDay.number - start_jd;
    var decade0 = Math.floor(fixed / 2247);
    var dayOfDecade = fixed - (decade0 * 2247);
    var yearOfDecade = Math.floor(dayOfDecade / 224) + 1;
    var dayOfYear = dayOfDecade % 224 + 1;
    if (yearOfDecade == 11) { yearOfDecade -= 1; dayOfYear += 224; }
    var year = decade0 * 10 + yearOfDecade - 1;
    if (year >= 0) year += 1;
    return new daycount.counts.venus({
      year: year,
      dayOfYear: dayOfYear,
    });
  };

  venus.pattern = /[Vv][Cc]:?(-?[1-9]\d*)\/(\d+)(\+[1-7])?/;

  venus.from_String = function(string) {
    var match = venus.pattern.exec(string);
    if (!match) return null;
    var year = parseInt(match[1]);
    var dayOfYear = parseInt(match[2]) + (match[3] ? parseInt(match[3]) : 0);
    return new venus({year:year,dayOfYear:dayOfYear});
  };

  venus.prototype.toString = function() {
    return 'VC:' + (this.year || 'x') + '/'
      + (this.dayOfYear <= 224 ? this.dayOfYear : '224+' + this.dayOfWeek)
      + ' (' + (this.dayOfYear <= 224
        ? (this.yearOfDecade + ',' + (this.week || 'x') + ',' + this.dayOfWeek)
        : ('\u221E,' + this.dayOfWeek))
      + ')';
  }

  return venus;
})();
