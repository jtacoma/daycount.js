describe("daycount.counts.badi", function() {

  var example_gregorian = new daycount.counts.gregorian(
    { year: 1844, month: 3, dayOfMonth: 21 });

  it("should exist as a well-formed class", function() {
    expect(new daycount.counts.badi().constructor.name).toEqual('badi');
  });

  it("should handle conversion from string", function() {
    var badi = daycount.counts.badi.from_String('5:4:3:2');
    expect(badi.major).toEqual(5);
    expect(badi.cycle).toEqual(4);
    expect(badi.year).toEqual(3);
    expect(badi.dayOfYear).toEqual(2);
  });

  it("should handle conversion from gregorian", function() {
    expect(daycount.counts.badi.from_gregorian).toBeDefined();
    var references = [
      {
        gregorian: example_gregorian,
        badi: new daycount.counts.badi(
          { major: 0, cycle: 0, year: 0, dayOfYear: 1 }),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var badi = daycount.counts.badi.from_gregorian(ref.gregorian);
      expect(badi.toString()).toEqual(ref.badi.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_gregorian);
    expect(moment.badi).toBeDefined();
    expect(moment.badi.constructor === daycount.counts.badi).toBeTruthy();
    expect(moment.badi.major).toEqual(0);
    expect(moment.badi.cycle).toEqual(0);
    expect(moment.badi.year).toEqual(0);
    expect(moment.badi.dayOfYear).toEqual(1);
    expect(moment.badi.month).toEqual(1);
    expect(moment.badi.dayOfMonth).toEqual(1);
  });

  it("should have a nice toString()", function() {
    expect(new daycount.counts.badi(
      { major: 13, cycle: 12, year: 11, dayOfYear: 10 })
      .toString()).toEqual('13:12:11:10');
  });

});
