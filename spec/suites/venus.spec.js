describe("daycount.counts.venus", function() {

  var example_gregorian = new daycount.counts.gregorian({year:2011, month:2, dayOfMonth:17});

  it("should exist as a well-formed class", function() {
    expect(daycount.counts.venus).toBeDefined();
    expect(daycount.counts.venus.prototype).toBeDefined();
    expect(daycount.counts.venus.name).toEqual('venus');
  });

  it("should handle conversion from local julian day", function() {
    expect(daycount.counts.venus.from_localJulianDay).toBeDefined();
    var references = [
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453951}),
        venus: new daycount.counts.venus({year:1,dayOfYear:1}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453952}),
        venus: new daycount.counts.venus({year:1,dayOfYear:2}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2453950}),
        venus: new daycount.counts.venus({year:-1,dayOfYear:231}),
      },
      {
        localJulianDay: new daycount.counts.localJulianDay({number:2456198}),
        venus: new daycount.counts.venus({year:11,dayOfYear:1}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var venus = daycount.counts.venus.from_localJulianDay(ref.localJulianDay);
      expect(venus.toString()).toEqual(ref.venus.toString());
    }
  });

  it("should handle conversion from string", function() {
    expect(daycount.counts.venus.from_String('Vc:1/1').toString()).toEqual('VC:1/1 (1,1,1)');
    expect(daycount.counts.venus.from_String('vC-123/224').toString()).toEqual('VC:-123/224 (8,32,7)');
    expect(daycount.counts.venus.from_String('VC:-11/224+3').toString()).toEqual('VC:-11/224+3 (\u221E,3)');
    expect(daycount.counts.venus.from_String('Vc:0/1')).toBeNull();
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_gregorian);
    expect(moment.venus).toBeDefined();
    expect(moment.venus.constructor.name).toEqual('venus');
    expect(moment.venus.year).toEqual(8);
    expect(moment.venus.dayOfYear).toEqual(92);
    expect(moment.venus.month).toEqual(4);
    expect(moment.venus.week).toEqual(14);
    expect(moment.venus.dayOfWeek).toEqual(1);
  });

  it("should have a nice toString()", function() {
    var venus = daycount.counts.venus.from_localJulianDay(new daycount.counts.localJulianDay({number:2453952}));
    expect(venus.toString()).toEqual('VC:1/2 (1,1,2)');
    venus = daycount.counts.venus.from_localJulianDay(new daycount.counts.localJulianDay({number:2453950}));
    expect(venus.toString()).toEqual('VC:-1/224+7 (\u221E,7)');
    venus = daycount.counts.venus.from_localJulianDay(new daycount.counts.localJulianDay({number:2453942}));
    expect(venus.toString()).toEqual('VC:-1/223 (10,32,6)');
  });

});
