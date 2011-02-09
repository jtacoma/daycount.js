describe("calendars.counts.gregorian", function() {

  var example = new Date(2012, 11, 21); // January = 0

  it("should exist as a well-formed class", function() {
    expect(calendars.counts.gregorian).toBeDefined();
    expect(calendars.counts.gregorian.prototype).toBeDefined();
    expect(new calendars.counts.gregorian().constructor.name).toEqual('gregorian');
  });

  it("should handle conversion from system datetime", function() {
    expect(calendars.counts.gregorian.from_Date).toBeDefined();
    var gregorian = calendars.counts.gregorian.from_Date(example);
    expect(gregorian.year).toEqual(2012);
    expect(gregorian.month).toEqual(12); // January = 1
    expect(gregorian.date).toEqual(21);
  });

  it("should show up correctly in new days", function() {
    var day = new calendars.day(example);
    expect(day.gregorian.constructor.name).toEqual('gregorian');
    expect(day.gregorian.year).toEqual(2012);
    expect(day.gregorian.month).toEqual(12); // January = 1
    expect(day.gregorian.date).toEqual(21);
  });

  it("should recognize leap years", function() {
    expect(new calendars.counts.gregorian({year:2012}).isLeapYear).toBeTruthy();
    expect(new calendars.counts.gregorian({year:2011}).isLeapYear).toBeFalsy();
    expect(new calendars.counts.gregorian({year:2000}).isLeapYear).toBeTruthy();
    expect(new calendars.counts.gregorian({year:1900}).isLeapYear).toBeFalsy();
  });

  it("should support addition and subtraction", function() {
    var gregorian = new calendars.day(example).gregorian;
    var yearago = gregorian.plus(-366);
    expect(yearago.year).toEqual(gregorian.year - 1);
    expect(yearago.month).toEqual(gregorian.month);
    expect(yearago.date).toEqual(gregorian.date);
    var yearsago = gregorian.plus(-366-365-365);
    expect(yearsago.year).toEqual(gregorian.year - 3);
    expect(yearsago.month).toEqual(gregorian.month);
    expect(yearsago.date).toEqual(gregorian.date);
  });

});
