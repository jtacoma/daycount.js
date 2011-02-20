describe("daycount.counts.localJulianDay", function() {

  var example = new Date(2012, 11, 21); // January = 0

  it("should exist as a well-formed class", function() {
    expect(new daycount.counts.localJulianDay().constructor.name).toEqual('localJulianDay');
  });

  it("should handle conversion from system datetime", function() {
    var localJulianDay = daycount.counts.localJulianDay.from_Date(example);
    expect(localJulianDay.number).toEqual(2456283);
  });

  it("should handle conversion from gregorian", function() {
    var gregorian = daycount.counts.gregorian.from_Date(example);
    var localJulianDay = daycount.counts.localJulianDay.from_gregorian(gregorian);
    expect(localJulianDay.number).toEqual(2456283);
  });

  it("should handle conversion from string", function() {
    var localJulianDay = daycount.counts.localJulianDay.from_String('LJD:2456283');
    expect(localJulianDay.number).toEqual(2456283);
    var localJulianDay = daycount.counts.localJulianDay.from_String('LJD:1');
    expect(localJulianDay.number).toEqual(1);
    var localJulianDay = daycount.counts.localJulianDay.from_String('JD:1');
    expect(localJulianDay).toBeNull();
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example);
    expect(moment.localJulianDay.constructor.name).toEqual('localJulianDay');
    expect(moment.localJulianDay.number).toEqual(2456283);
  });

  it("should support addition", function() {
    var localJulianDay = new daycount.moment(example).localJulianDay;
    var yearago = localJulianDay.plus(-366);
    expect(yearago.number).toEqual(localJulianDay.number - 366);
  });

  it("should have a nice toString()", function() {
    var localJulianDay = new daycount.moment(example).localJulianDay;
    expect(localJulianDay.toString()).toEqual('2456283');
  });

});
