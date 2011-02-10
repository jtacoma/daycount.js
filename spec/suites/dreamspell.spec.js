describe("calendars.counts.dreamspell", function() {

  var example = new calendars.counts.gregorian({year:2012, month:12, dayOfMonth:21});

  it("should exist as a well-formed class", function() {
    expect(calendars.counts.dreamspell).toBeDefined();
    expect(calendars.counts.dreamspell.prototype).toBeDefined();
    expect(calendars.counts.dreamspell.name).toEqual('dreamspell');
  });

  it("should handle conversion from gregorian", function() {
    expect(calendars.counts.dreamspell.from_gregorian).toBeDefined();
    var references = [
      {
        gregorian: new calendars.counts.gregorian({year:2012, month:12, dayOfMonth:22}),
        dreamspell: new calendars.counts.dreamspell({month:6, dayOfMonth:10, kin:208}),
      },
      {
        gregorian: new calendars.counts.gregorian({year:2012, month:12, dayOfMonth:21}),
        dreamspell: new calendars.counts.dreamspell({month:6, dayOfMonth:9, kin:207}),
      },
      {
        gregorian: new calendars.counts.gregorian({year:2012, month:12, dayOfMonth:20}),
        dreamspell: new calendars.counts.dreamspell({month:6, dayOfMonth:8, kin:206}),
      },
      {
        gregorian: new calendars.counts.gregorian({year:2011, month:2, dayOfMonth:9}),
        dreamspell: new calendars.counts.dreamspell({month:8, dayOfMonth:3, kin:47}),
      },
      {
        gregorian: new calendars.counts.gregorian({year:2000, month:3, dayOfMonth:1}),
        dreamspell: new calendars.counts.dreamspell({month:8, dayOfMonth:23, kin:212}),
      },
      {
        gregorian: new calendars.counts.gregorian({year:2000, month:2, dayOfMonth:28}),
        dreamspell: new calendars.counts.dreamspell({month:8, dayOfMonth:22, kin:211}),
      },
      {
        gregorian: new calendars.counts.gregorian({year:1978, month:9, dayOfMonth:19}),
        dreamspell: new calendars.counts.dreamspell({month:2, dayOfMonth:28, kin:184}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var dreamspell = calendars.counts.dreamspell.from_gregorian(ref.gregorian);
      expect(dreamspell.toString()).toEqual(ref.dreamspell.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var day = new calendars.day(example);
    expect(day.dreamspell).toBeDefined();
    expect(day.dreamspell.constructor.name).toEqual('dreamspell');
    expect(day.dreamspell.toString()).toEqual('6.9.207');
  });

  it("should have a nice toString()", function() {
    var dreamspell = new calendars.counts.dreamspell({month:1,dayOfMonth:2,kin:3});
    expect(dreamspell.toString()).toEqual('1.2.3');
  });

});
