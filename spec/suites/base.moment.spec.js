describe("daycount.moment", function() {

  it("should be incrementable, with earth solar day as the default unit", function() {
    var moment = new daycount.moment(new Date(2012, 11, 21));
    var jdn = moment.julianDay.number;
    moment.incrementEarthSolarDays(1);
    moment.increment(2);
    expect(moment.increment === moment.incrementEarthSolarDays).toEqual(true);
    expect(moment.gregorian.year).toEqual(2012);
    expect(moment.gregorian.month).toEqual(12);
    expect(moment.gregorian.dayOfMonth).toEqual(24);
    moment.incrementEarthSolarDays(1);
    moment.increment(2);
    expect(moment.julianDay.number).toEqual(jdn+6);
  });

});
