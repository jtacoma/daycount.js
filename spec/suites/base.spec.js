describe("base", function() {

  var foo = undefined;

  beforeEach(function() {
  });

  it("should exist", function() {
    expect(calendars).toBeDefined();
    expect(calendars.version_).toBeDefined();
    expect(calendars.version_.major).toBeDefined();
  });

});
