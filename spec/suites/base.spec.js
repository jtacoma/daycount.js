describe("daycount (base)", function() {

  it("should exist and be a well-formed module", function() {
    expect(daycount).toBeDefined();
    expect(daycount.version_).toBeDefined();
    expect(daycount.version_.major).toBeDefined();
  });

  it("should have a well-formed day class", function() {
    expect(daycount.day).toBeDefined();
    expect(daycount.day.prototype).toBeDefined();
    expect(new daycount.day().constructor.name).toEqual('day');
  });

  it("should have a list of counts", function() {
    expect(daycount.counts).toBeDefined();
  });

});
