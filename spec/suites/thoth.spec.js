describe("daycount.counts.thoth", function() {

  var example_gregorian = new daycount.counts.gregorian({year:2011, month:2, dayOfMonth:17});

  it("should exist as a well-formed class", function() {
    expect(daycount.counts.thoth).toBeDefined();
    expect(daycount.counts.thoth.prototype).toBeDefined();
    expect(daycount.counts.thoth.name).toEqual('thoth');
  });

  it("should handle conversion from local julian day", function() {
    expect(daycount.counts.thoth.from_localJulianDay).toBeDefined();
    var references = [
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2452993}),
        thoth: new daycount.counts.thoth({year:1,dayOfYear:1}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2452994}),
        thoth: new daycount.counts.thoth({year:1,dayOfYear:2}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2452992}),
        thoth: new daycount.counts.thoth({dayOfYear:88}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var thoth = daycount.counts.thoth.from_localJulianDay(ref.localJulianDay);
      expect(thoth.toString()).toEqual(ref.thoth.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_gregorian);
    expect(moment.thoth).toBeDefined();
    expect(moment.thoth.constructor.name).toEqual('thoth');
    expect(moment.thoth.dayOfYear).toEqual(66);
  });

  it("should have a nice toString()", function() {
    var thoth = daycount.counts.thoth.from_localJulianDay(new daycount.counts.localJulianDay({number:2452993}));
    expect(thoth.toString()).toEqual('TC:1/1');
    var thoth = daycount.counts.thoth.from_localJulianDay(new daycount.counts.localJulianDay({number:2452993+87}));
    expect(thoth.toString()).toEqual('TC:1/88');
    var thoth = daycount.counts.thoth.from_localJulianDay(new daycount.counts.localJulianDay({number:2452993+89}));
    expect(thoth.toString()).toEqual('TC:2/2');
    thoth = daycount.counts.thoth.from_localJulianDay(new daycount.counts.localJulianDay({number:2452993-1}));
    expect(thoth.toString()).toEqual('TC:x/88');
  });

});
