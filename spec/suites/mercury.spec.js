describe("daycount.counts.mercury", function() {

  var example_gregorian = new daycount.counts.gregorian({year:2011, month:2, dayOfMonth:17});

  it("should exist as a well-formed class", function() {
    expect(daycount.counts.mercury).toBeDefined();
    expect(daycount.counts.mercury.prototype).toBeDefined();
    expect(daycount.counts.mercury.name).toEqual('mercury');
  });

  it("should handle conversion from local julian day", function() {
    expect(daycount.counts.mercury.from_localJulianDay).toBeDefined();
    var references = [
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453690}),
        mercury: new daycount.counts.mercury({year:1,dayOfYear:1}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453691}),
        mercury: new daycount.counts.mercury({year:1,dayOfYear:2}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453689}),
        mercury: new daycount.counts.mercury({dayOfYear:687}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var mercury = daycount.counts.mercury.from_localJulianDay(ref.localJulianDay);
      expect(mercury.toString()).toEqual(ref.mercury.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_gregorian);
    expect(moment.mercury).toBeDefined();
    expect(moment.mercury.constructor.name).toEqual('mercury');
    expect(moment.mercury.dayOfYear).toEqual(547);
  });

  it("should have a nice toString()", function() {
    var mercury = daycount.counts.mercury.from_localJulianDay(new daycount.counts.localJulianDay({number:2453690}));
    expect(mercury.toString()).toEqual('MC:1/1');
    var mercury = daycount.counts.mercury.from_localJulianDay(new daycount.counts.localJulianDay({number:2453690+686}));
    expect(mercury.toString()).toEqual('MC:1/687');
    var mercury = daycount.counts.mercury.from_localJulianDay(new daycount.counts.localJulianDay({number:2453690+688}));
    expect(mercury.toString()).toEqual('MC:2/2');
    mercury = daycount.counts.mercury.from_localJulianDay(new daycount.counts.localJulianDay({number:2453689}));
    expect(mercury.toString()).toEqual('MC:x/687');
  });

});
