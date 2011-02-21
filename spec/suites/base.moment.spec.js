describe("daycount.moment", function() {

  it("should exist and be a well-formed moment class", function() {
    expect(new daycount.moment().constructor.name).toEqual('moment');
  });

  it("should support addition, with earth solar day as the default unit", function() {
    var moment = new daycount.moment(new Date(2012, 11, 21));
    var jdn = moment.localJulianDay.number;
    moment = moment.plusEarthSolarDays(1).plus(2);
    expect(moment.plus === moment.plusEarthSolarDays).toEqual(true);
    expect(moment.gregorian.year).toEqual(2012);
    expect(moment.gregorian.month).toEqual(12);
    expect(moment.gregorian.dayOfMonth).toEqual(24);
    moment = moment.plusEarthSolarDays(2).plus(1);
    expect(moment.localJulianDay.number).toEqual(jdn+6);
    var moment = new daycount.moment('LJD:7999').plus(1);
    expect(moment.localJulianDay.number).toEqual(8000);
  });

  it("should build from a string, correctly", function() {
    var moment = new daycount.moment('2012-12-21');
    expect(moment.gregorian.year).toEqual(2012);
    expect(moment.gregorian.month).toEqual(12);
    expect(moment.gregorian.dayOfMonth).toEqual(21);
    var moment = new daycount.moment('not a date of any kind');
    expect(moment.gregorian).toBeUndefined();
    expect(moment.isUnknown).toBeTruthy();
    var moment = new daycount.moment('LJD:7000');
    expect(moment.localJulianDay.number).toEqual(7000);
  });

});
