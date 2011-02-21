describe("daycount (base)", function() {

  it("should exist and be a well-formed module", function() {
    expect(daycount).toBeDefined();
    expect(daycount.version_).toBeDefined();
    expect(daycount.version_.major).toBeDefined();
  });

  it("should have a list of counts", function() {
    expect(daycount.counts).toBeDefined();
  });

});
