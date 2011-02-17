describe("daycount (base)", function() {

  it("should exist and be a well-formed module", function() {
    expect(daycount).toBeDefined();
    expect(daycount.version_).toBeDefined();
    expect(daycount.version_.major).toBeDefined();
  });

  it("should have a well-formed moment class", function() {
    expect(daycount.moment).toBeDefined();
    expect(daycount.moment.prototype).toBeDefined();
    expect(new daycount.moment().constructor.name).toEqual('moment');
  });

  it("should have a list of counts", function() {
    expect(daycount.counts).toBeDefined();
  });

});
