describe("daycount.counts.chineseYear", function() {

  it("should exist as a well-formed class", function() {
    expect(new daycount.counts.chineseYear().constructor.name).toEqual('chineseYear');
  });

  it("should handle conversion from gregorian", function() {
    var references = [
      {
        gregorian: daycount.counts.gregorian.from_String('2004-03-01'),
        chineseYear: new daycount.counts.chineseYear({stem:1,branch:9}),
      },
      {
        gregorian: daycount.counts.gregorian.from_String('1998-11-01'),
        chineseYear: new daycount.counts.chineseYear({stem:5,branch:3}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var chineseYear = daycount.counts.chineseYear.from_gregorian(ref.gregorian);
      expect(chineseYear.stem).toEqual(ref.chineseYear.stem);
      expect(chineseYear.branch).toEqual(ref.chineseYear.branch);
      var previousYear = daycount.counts.chineseYear.from_gregorian(
        new daycount.counts.gregorian({year:ref.gregorian.year,month:1,day:1}));
      expect(previousYear.stem).toNotEqual(chineseYear.stem);
      expect(previousYear.branch).toNotEqual(chineseYear.branch);
    }
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment('2004-03-01');
    expect(moment.chineseYear).toBeDefined();
    expect(moment.chineseYear.constructor === daycount.counts.chineseYear).toBeTruthy();
    expect(moment.chineseYear.stem).toEqual(1);
    expect(moment.chineseYear.branch).toEqual(9);
  });

  it("should have a nice toString()", function() {
    expect(new daycount.counts.chineseYear({stem:1,branch:3}).toString()).toEqual('1/3');
  });

});
