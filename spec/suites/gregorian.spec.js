describe("daycount.counts.gregorian", function() {

  var example = new Date(2012, 11, 21); // January = 0

  it("should exist as a well-formed class", function() {
    expect(new daycount.counts.gregorian().constructor.name).toEqual('gregorian');
  });

  it("should handle conversion from system datetime", function() {
    var gregorian = daycount.counts.gregorian.from_Date(example);
    expect(gregorian.year).toEqual(2012);
    expect(gregorian.month).toEqual(12); // January = 1
    expect(gregorian.dayOfMonth).toEqual(21);
    expect(gregorian.dayOfYear).toEqual(356);
    expect(gregorian.dayOfWeek).toEqual(6);
  });

  it("should handle conversion from local julian day number", function() {
    var localJulianDay = daycount.counts.localJulianDay.from_Date(example);
    var gregorian = daycount.counts.gregorian.from_localJulianDay(localJulianDay);
    expect(gregorian.year).toEqual(2012);
    expect(gregorian.month).toEqual(12); // January = 1
    expect(gregorian.dayOfMonth).toEqual(21);
    expect(gregorian.dayOfYear).toEqual(356);
    expect(gregorian.dayOfWeek).toEqual(6);
  });

  it("should handle conversion from string", function() {
    var gregorian = daycount.counts.gregorian.from_String('2012-12-21');
    expect(gregorian.year).toEqual(2012);
    expect(gregorian.month).toEqual(12);
    expect(gregorian.dayOfMonth).toEqual(21);
    expect(gregorian.dayOfYear).toEqual(356);
    expect(gregorian.dayOfWeek).toEqual(6);
    var gregorian = daycount.counts.gregorian.from_String('1978-09-19');
    expect(gregorian.year).toEqual(1978);
    expect(gregorian.month).toEqual(9);
    expect(gregorian.dayOfMonth).toEqual(19);
    expect(gregorian.dayOfWeek).toEqual(3);
    var gregorian = daycount.counts.gregorian.from_String('1900-01-01');
    expect(gregorian.dayOfWeek).toEqual(2);
    var gregorian = daycount.counts.gregorian.from_String('2000-01-01');
    expect(gregorian.dayOfWeek).toEqual(7);
    var gregorian = daycount.counts.gregorian.from_String('2000-03-01');
    expect(gregorian.dayOfWeek).toEqual(4);
    var gregorian = daycount.counts.gregorian.from_String('1999-01-01');
    expect(gregorian.dayOfWeek).toEqual(6);
    var gregorian = daycount.counts.gregorian.from_String('1989-01-01');
    expect(gregorian.dayOfWeek).toEqual(1);
    var gregorian = daycount.counts.gregorian.from_String('-3114-08-11');
    expect(gregorian.year).toEqual(-3114);
    expect(gregorian.month).toEqual(8);
    expect(gregorian.dayOfMonth).toEqual(11);
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
    expect(new daycount.counts.gregorian({year:1900,month:1}).countLeapDaysSince({year:2012,month:12})).toEqual(-28);
  });

  it("should support difference", function() {
    var gregorian = new daycount.moment(example).gregorian;
    var ljd = daycount.counts.localJulianDay.from_gregorian(gregorian);
    for(var diff = 0; diff > -2000; diff -= 17)
    {
      var by_plus = daycount.counts.gregorian.from_localJulianDay(new daycount.counts.localJulianDay(ljd.number + diff));
      var by_plus_from = by_plus.countDaysSince(gregorian);
      expect(by_plus_from).toEqual(diff);
      var from_by_plus = gregorian.countDaysSince(by_plus);
      expect(from_by_plus).toEqual(-diff);
      expect(from_by_plus).toEqual(-by_plus_from);
    }
  });

  it("should have a nice toString()", function () {
    var gregorian = daycount.counts.gregorian.from_Date(example);
    expect(gregorian.toString()).toEqual('2012-12-21');
    gregorian = daycount.counts.gregorian.from_Date(new Date(2012,0,9));
    expect(gregorian.toString()).toEqual('2012-01-09');
  });

  it("should name its months", function() {
    var gregorian = daycount.counts.gregorian.from_Date(example);
    expect(gregorian.monthName()).toEqual('December');
  });

  it("should name its week days", function() {
    var gregorian = daycount.counts.gregorian.from_Date(example);
    expect(gregorian.dayOfWeekName()).toEqual('Friday');
  });

});
