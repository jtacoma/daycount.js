describe("daycount.counts.bahai", function() {

  var example_gregorian = new daycount.counts.gregorian(
    { year: 1844, month: 3, dayOfMonth: 21 });

  it("should exist as a well-formed class", function() {
    expect(new daycount.counts.bahai().constructor.name).toEqual('bahai');
  });

  it("should handle conversion from string", function() {
    var bahai = daycount.counts.bahai.from_String('5:4:3:2');
    expect(bahai.major).toEqual(5);
    expect(bahai.cycle).toEqual(4);
    expect(bahai.year).toEqual(3);
    expect(bahai.dayOfYear).toEqual(2);
  });

  it("should handle conversion from gregorian", function() {
    expect(daycount.counts.bahai.from_gregorian).toBeDefined();
    var references = [
      {
        gregorian: example_gregorian,
        bahai: new daycount.counts.bahai(
          { major: 0, cycle: 0, year: 0, dayOfYear: 1 }),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var bahai = daycount.counts.bahai.from_gregorian(ref.gregorian);
      expect(bahai.toString()).toEqual(ref.bahai.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_gregorian);
    expect(moment.bahai).toBeDefined();
    expect(moment.bahai.constructor === daycount.counts.bahai).toBeTruthy();
    expect(moment.bahai.major).toEqual(0);
    expect(moment.bahai.cycle).toEqual(0);
    expect(moment.bahai.year).toEqual(0);
    expect(moment.bahai.dayOfYear).toEqual(1);
    expect(moment.bahai.month).toEqual(1);
    expect(moment.bahai.dayOfMonth).toEqual(1);
  });

  it("should have a nice toString()", function() {
    expect(new daycount.counts.bahai(
      { major: 13, cycle: 12, year: 11, dayOfYear: 10 })
      .toString()).toEqual('13:12:11:10');
  });

});
