describe("daycount.counts.thoth", function() {

  var example_julianDay = new daycount.counts.julianDay({number:2455610});

  it("should exist as a well-formed class", function() {
    expect(daycount.counts.thoth).toBeDefined();
    expect(daycount.counts.thoth.prototype).toBeDefined();
    expect(daycount.counts.thoth.name).toEqual('thoth');
  });

  it("should handle conversion from julianDay", function() {
    expect(daycount.counts.thoth.from_julianDay).toBeDefined();
    var references = [
      {
        julianDay: example_julianDay,
        thoth: new daycount.counts.thoth({venusYear:8,venusDayOfYear:92}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var thoth = daycount.counts.thoth.from_julianDay(ref.julianDay);
      expect(thoth.toString()).toEqual(ref.thoth.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_julianDay);
    expect(moment.thoth).toBeDefined();
    expect(moment.thoth.constructor.name).toEqual('thoth');
    expect(moment.thoth.venusYear).toEqual(8);
    expect(moment.thoth.venusDayOfYear).toEqual(92);
    expect(moment.thoth.venusMonth).toEqual(4);
    expect(moment.thoth.venusWeek).toEqual(14);
    expect(moment.thoth.venusDayOfWeek).toEqual(1);
  });

  it("should have a nice toString()", function() {
    var thoth = daycount.counts.thoth.from_julianDay(example_julianDay);
    expect(thoth.toString()).toEqual('VC:8/92 (8,14,1)');
  });

});
