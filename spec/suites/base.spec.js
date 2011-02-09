describe("calendars (base)", function() {

  it("should exist and be a well-formed module", function() {
    expect(calendars).toBeDefined();
    expect(calendars.version_).toBeDefined();
    expect(calendars.version_.major).toBeDefined();
  });

  it("should have a well-formed day class", function() {
    expect(calendars.day).toBeDefined();
    expect(calendars.day.prototype).toBeDefined();
    expect(new calendars.day().constructor.name).toEqual('day');
  });

  it("should have a list of counts", function() {
    expect(calendars.counts).toBeDefined();
  });

});
