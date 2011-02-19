describe("daycount.counts.venus", function() {

  var example_gregorian = new daycount.counts.gregorian({year:2011, month:2, dayOfMonth:17});

  it("should exist as a well-formed class", function() {
    expect(daycount.counts.venus).toBeDefined();
    expect(daycount.counts.venus.prototype).toBeDefined();
    expect(daycount.counts.venus.name).toEqual('venus');
  });

  it("should handle conversion from gregorian", function() {
    expect(daycount.counts.venus.from_gregorian).toBeDefined();
    var references = [
      {
        gregorian: example_gregorian,
        venus: new daycount.counts.venus({year:8,dayOfYear:92}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var venus = daycount.counts.venus.from_gregorian(ref.gregorian);
      expect(venus.toString()).toEqual(ref.venus.toString());
    }
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
    var venus = daycount.counts.venus.from_gregorian(example_gregorian);
    expect(venus.toString()).toEqual('VC:8/92 (8,14,1)');
  });

});
