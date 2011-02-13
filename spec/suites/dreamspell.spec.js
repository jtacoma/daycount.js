describe("daycount.counts.dreamspell", function() {

  var example = new daycount.counts.gregorian({year:2012, month:12, dayOfMonth:21});

  it("should exist as a well-formed class", function() {
    expect(daycount.counts.dreamspell).toBeDefined();
    expect(daycount.counts.dreamspell.prototype).toBeDefined();
    expect(daycount.counts.dreamspell.name).toEqual('dreamspell');
  });

  it("should handle conversion from gregorian", function() {
    expect(daycount.counts.dreamspell.from_gregorian).toBeDefined();
    var references = [
      {
        gregorian: new daycount.counts.gregorian({year:2012, month:12, dayOfMonth:22}),
        dreamspell: new daycount.counts.dreamspell({month:6, dayOfMonth:10, kin:208}),
      },
      {
        gregorian: new daycount.counts.gregorian({year:2012, month:12, dayOfMonth:21}),
        dreamspell: new daycount.counts.dreamspell({month:6, dayOfMonth:9, kin:207}),
      },
      {
        gregorian: new daycount.counts.gregorian({year:2012, month:12, dayOfMonth:20}),
        dreamspell: new daycount.counts.dreamspell({month:6, dayOfMonth:8, kin:206}),
      },
      {
        gregorian: new daycount.counts.gregorian({year:2011, month:2, dayOfMonth:9}),
        dreamspell: new daycount.counts.dreamspell({month:8, dayOfMonth:3, kin:47}),
      },
      {
        gregorian: new daycount.counts.gregorian({year:2000, month:3, dayOfMonth:1}),
        dreamspell: new daycount.counts.dreamspell({month:8, dayOfMonth:23, kin:212}),
      },
      {
        gregorian: new daycount.counts.gregorian({year:2000, month:2, dayOfMonth:28}),
        dreamspell: new daycount.counts.dreamspell({month:8, dayOfMonth:22, kin:211}),
      },
      {
        gregorian: new daycount.counts.gregorian({year:1978, month:9, dayOfMonth:19}),
        dreamspell: new daycount.counts.dreamspell({month:2, dayOfMonth:28, kin:184}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var dreamspell = daycount.counts.dreamspell.from_gregorian(ref.gregorian);
      expect(dreamspell.toString()).toEqual(ref.dreamspell.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var day = new daycount.day(example);
    expect(day.dreamspell).toBeDefined();
    expect(day.dreamspell.constructor.name).toEqual('dreamspell');
    expect(day.dreamspell.toString()).toEqual('6.9.207');
    var day = new daycount.day(new Date(example.year, example.month-1, example.dayOfMonth));
    expect(day.dreamspell).toBeDefined();
    expect(day.dreamspell.constructor.name).toEqual('dreamspell');
    expect(day.dreamspell.toString()).toEqual('6.9.207');
  });

  it("should have a nice toString()", function() {
    var dreamspell = new daycount.counts.dreamspell({month:1,dayOfMonth:2,kin:3});
    expect(dreamspell.toString()).toEqual('1.2.3');
  });

});
