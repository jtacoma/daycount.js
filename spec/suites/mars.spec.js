describe("daycount.counts.mars", function() {

  var example_gregorian = new daycount.counts.gregorian({year:2011, month:2, dayOfMonth:17});

  it("should exist as a well-formed class", function() {
    expect(new daycount.counts.mars().constructor.name === 'mars').toBeTruthy();
  });

  it("should handle conversion from local julian day", function() {
    expect(daycount.counts.mars.from_localJulianDay).toBeDefined();
    var references = [
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453690}),
        mars: new daycount.counts.mars({year:1,dayOfYear:1}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453691}),
        mars: new daycount.counts.mars({year:1,dayOfYear:2}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453689}),
        mars: new daycount.counts.mars({year:-1,dayOfYear:687}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var mars = daycount.counts.mars.from_localJulianDay(ref.localJulianDay);
      expect(mars.toString()).toEqual(ref.mars.toString());
    }
  });

  it("should handle conversion from string", function() {
    expect(daycount.counts.mars.from_String('Mc:1/1').toString()).toEqual('MC:1/1 (1:1)');
    expect(daycount.counts.mars.from_String('mC-123/687').toString()).toEqual('MC:-123/687 (-123:x/x/x/x/x/x/300)');
    expect(daycount.counts.mars.from_String('MC:0/1')).toBeNull();
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_gregorian);
    expect(moment.mars).toBeDefined();
    expect(moment.mars.constructor.name).toEqual('mars');
    expect(moment.mars.dayOfYear).toEqual(547);
  });

  it("should have a nice toString()", function() {
    var mars = daycount.counts.mars.from_localJulianDay(new daycount.counts.localJulianDay({number:2453690}));
    expect(mars.toString()).toEqual('MC:1/1 (1:1)');
    mars = daycount.counts.mars.from_localJulianDay(new daycount.counts.localJulianDay({number:2453690+686}));
    expect(mars.toString()).toEqual('MC:1/687 (1:x/x/x/x/x/x/300)');
    mars = daycount.counts.mars.from_localJulianDay(new daycount.counts.localJulianDay({number:2453690+688}));
    expect(mars.toString()).toEqual('MC:2/2 (2:2)');
    mars = daycount.counts.mars.from_localJulianDay(new daycount.counts.localJulianDay({number:2453689}));
    expect(mars.toString()).toEqual('MC:-1/687 (-1:x/x/x/x/x/x/300)');
  });

});
