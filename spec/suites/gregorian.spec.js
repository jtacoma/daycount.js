describe("daycount.counts.gregorian", function() {

  var example = new Date(2012, 11, 21); // January = 0

  it("should exist as a well-formed class", function() {
    expect(daycount.counts.gregorian).toBeDefined();
    expect(daycount.counts.gregorian.prototype).toBeDefined();
    expect(new daycount.counts.gregorian().constructor.name).toEqual('gregorian');
  });

  it("should handle conversion from system datetime", function() {
    expect(daycount.counts.gregorian.from_Date).toBeDefined();
    var gregorian = daycount.counts.gregorian.from_Date(example);
    expect(gregorian.year).toEqual(2012);
    expect(gregorian.month).toEqual(12); // January = 1
    expect(gregorian.dayOfMonth).toEqual(21);
    expect(gregorian.dayOfYear).toEqual(356);
  });

  it("should handle conversion from local julian day number", function() {
    expect(daycount.counts.gregorian.from_localJulianDay).toBeDefined();
    var localJulianDay = daycount.counts.localJulianDay.from_Date(example);
    var gregorian = daycount.counts.gregorian.from_localJulianDay(localJulianDay);
    expect(gregorian.year).toEqual(2012);
    expect(gregorian.month).toEqual(12); // January = 1
    expect(gregorian.dayOfMonth).toEqual(21);
    expect(gregorian.dayOfYear).toEqual(356);
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example);
    expect(moment.gregorian.constructor.name).toEqual('gregorian');
    expect(moment.gregorian.year).toEqual(2012);
    expect(moment.gregorian.month).toEqual(12); // January = 1
    expect(moment.gregorian.dayOfMonth).toEqual(21);
    expect(moment.gregorian.dayOfYear).toEqual(356);
  });

  it("should recognize leap years", function() {
    expect(new daycount.counts.gregorian({year:2012}).isLeapYear).toBeTruthy();
    expect(new daycount.counts.gregorian({year:2011}).isLeapYear).toBeFalsy();
    expect(new daycount.counts.gregorian({year:2000}).isLeapYear).toBeTruthy();
    expect(new daycount.counts.gregorian({year:1900}).isLeapYear).toBeFalsy();
  });

  it("should count leap days between dates", function() {
    expect(daycount.counts.gregorian.countLeapDaysBetween({year:1900,month:1}, {year:2012,month:12})).toEqual(28);
  });

  it("should support addition", function() {
    var gregorian = new daycount.moment(example).gregorian;
    for(var diff = 0; diff > -2000; diff -= 17)
    {
      var by_plus = gregorian.plusDays(diff);
      var system = new Date(gregorian.year, gregorian.month-1, gregorian.dayOfMonth+diff);
      var by_system = daycount.counts.gregorian.from_Date(system);
      expect(by_plus.toString()).toEqual(by_system.toString());
    }
    var extratest = gregorian.from(new daycount.counts.gregorian({year:1978,month:9,dayOfMonth:19}));
    var verify = new Date(gregorian.year, gregorian.month-1, gregorian.dayOfMonth - extratest);
    expect(verify.toISOString().split('T')[0]).toEqual('1978-09-19');
  });

  it("should support difference", function() {
    var gregorian = new daycount.moment(example).gregorian;
    for(var diff = 0; diff > -2000; diff -= 17)
    {
      var by_plus = gregorian.plusDays(diff);
      var by_plus_from = by_plus.from(gregorian);
      expect(by_plus_from).toEqual(diff);
      var from_by_plus = gregorian.from(by_plus);
      expect(from_by_plus).toEqual(-diff);
      expect(from_by_plus).toEqual(-by_plus_from);
    }
  });

  it("should have a nice toString()", function () {
    var gregorian = daycount.counts.gregorian.from_Date(example);
    expect(gregorian.toString()).toEqual('2012-12-21');
  });

});
