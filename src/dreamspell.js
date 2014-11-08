daycount.counts.dreamspell = (function () {

  function dreamspell (arg) {
    this.month = parseInt(arg && arg.month);
    this.dayOfMonth = parseInt(arg && arg.dayOfMonth);
    this.dayOfYear = isNaN(this.month) ? 0
      : (this.month - 1) * 28 + this.dayOfMonth;
    this.kin = parseInt(arg && arg.kin);
  };

  var reference = {
    gregorian: { year: 2012, month: 12, dayOfMonth: 21 },
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

  dreamspell.prototype.kinNumbers = function()
  {
    var numbers = {
      kin:  this.kin,
      tone: this.kin % 13,
      seal: this.kin % 20,
    }
    if (numbers.tone < 1)
      numbers.tone = 13 + numbers.tone;
    if (numbers.seal < 1)
      numbers.seal = 20 + numbers.seal;

    return numbers;
  };

  dreamspell.prototype.kinOracle = function()
  {
    var kin = this.kinNumbers();

    var oracle = {
      guide:    0,
      antipode: 0,
      analog:   0,
      occult:   0,
    }

    oracle.guide = this.kinGuide();

    oracle.antipode = kin.seal + 10;
    if(oracle.antipode > 20)
      oracle.antipode = kin.seal - 10;

    oracle.analog = 19 - kin.seal;
    if (oracle.analog <= 0)
      oracle.analog = oracle.analog + 20;

    oracle.occult = 21 - kin.seal;
    // tone = 14 - kin.tone

    return oracle;
  };

  dreamspell.prototype.kinWave = function()
  {
    var kin = this.kinNumbers();

    var wave = [], magnetic = 0;

    // wave number
    wave.push(Math.ceil( this.kin / 13 ));

    // magnetic seal
    if (kin.seal >= kin.tone)
      magnetic = kin.seal - kin.tone + 1;
    else
      magnetic = 20 + kin.seal - kin.tone + 1;

    wave.push(magnetic);

    for (var i = 1; i < 13; i++)
      wave.push( (magnetic + i) % 20 );

    return wave;
  }

  dreamspell.prototype.kinGuide = function()
  {
    var kin = this.kinNumbers();
    var guide;

    if (kin.tone == 1 || kin.tone == 6 || kin.tone == 11) {
      guide = kin.seal;
    } else if (kin.tone == 2 || kin.tone == 7 || kin.tone == 12) {
      guide = (kin.seal - 8) % 20;
    } else if (kin.tone == 3 || kin.tone == 8 || kin.tone == 13) {
      guide = (kin.seal + 4) % 20;
    } else if (kin.tone == 4 || kin.tone == 9) {
      guide = (kin.seal - 4) % 20;
    } else if (kin.tone == 5 || kin.tone == 10) {
      guide = (kin.seal + 8) % 20;
    }

    guide = guide < 1 ? 20 + guide : guide;

    return guide;
  }

  dreamspell.prototype.toString = function() {
    return (isNaN(this.month) ? 'x' : this.month)
      + '.' + (isNaN(this.dayOfMonth) ? 'x' : this.dayOfMonth)
      + '.' + (isNaN(this.kin) ? 'x' : this.kin)
  };

  return dreamspell;
})();
