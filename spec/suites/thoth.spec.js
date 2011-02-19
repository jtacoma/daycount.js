describe("daycount.counts.thoth", function() {

  var example_gregorian = new daycount.counts.gregorian({year:2011, month:2, dayOfMonth:17});

  it("should exist as a well-formed class", function() {
    expect(daycount.counts.thoth).toBeDefined();
    expect(daycount.counts.thoth.prototype).toBeDefined();
    expect(daycount.counts.thoth.name).toEqual('thoth');
  });

  it("should handle conversion from gregorian", function() {
    expect(daycount.counts.thoth.from_gregorian).toBeDefined();
    var references = [
      {
        gregorian: example_gregorian,
        thoth: new daycount.counts.thoth({venusYear:8,venusDayOfYear:92}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var thoth = daycount.counts.thoth.from_gregorian(ref.gregorian);
      expect(thoth.toString()).toEqual(ref.thoth.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_gregorian);
    expect(moment.thoth).toBeDefined();
    expect(moment.thoth.constructor.name).toEqual('thoth');
    expect(moment.thoth.venusYear).toEqual(8);
    expect(moment.thoth.venusDayOfYear).toEqual(92);
    expect(moment.thoth.venusMonth).toEqual(4);
    expect(moment.thoth.venusWeek).toEqual(14);
    expect(moment.thoth.venusDayOfWeek).toEqual(1);
  });

  it("should have a nice toString()", function() {
    var thoth = daycount.counts.thoth.from_gregorian(example_gregorian);
    expect(thoth.toString()).toEqual('VC:8/92 (8,14,1)');
  });

});
