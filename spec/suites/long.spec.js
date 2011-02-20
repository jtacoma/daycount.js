describe("daycount.counts.long", function() {

  var example_gregorian = new daycount.counts.gregorian({year:-3113, month:8, dayOfMonth:11});

  it("should exist as a well-formed class", function() {
    expect(new daycount.counts.long().constructor.name).toEqual('long');
  });

  it("should handle conversion from string", function() {
    var long = daycount.counts.long.from_String('1.2.3.4.5');
    expect(long.kin).toEqual(5);
    expect(long.winal).toEqual(4);
    expect(long.tun).toEqual(3);
    expect(long.katun).toEqual(2);
    expect(long.baktun).toEqual(1);
  });

  it("should handle conversion from local julian day", function() {
    expect(daycount.counts.long.from_localJulianDay).toBeDefined();
    var references = [
      {
        localJulianDay: new daycount.counts.localJulianDay(584284),
        long: new daycount.counts.long({baktun:0,katun:0,tun:0,winal:0,kin:1}),
      },
    ];
    for(var i = 0; i < references.length; ++i)
    {
      var ref = references[i];
      var long = daycount.counts.long.from_localJulianDay(ref.localJulianDay);
      expect(long.toString()).toEqual(ref.long.toString());
    }
  });

  it("should show up correctly in new days", function() {
    var moment = new daycount.moment(example_gregorian);
    expect(moment.long).toBeDefined();
    expect(moment.long.constructor === daycount.counts.long).toBeTruthy();
    expect(moment.long.kin).toEqual(0);
    expect(moment.long.winal).toEqual(0);
    expect(moment.long.tun).toEqual(0);
    expect(moment.long.katun).toEqual(0);
    expect(moment.long.baktun).toEqual(0);
  });

  it("should have a nice toString()", function() {
    expect(new daycount.counts.long({baktun:13,katun:12,tun:11,winal:10,kin:9}).toString()).toEqual('13.12.11.10.9');
  });

});
