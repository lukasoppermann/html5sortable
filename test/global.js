// testing globals
describe('Init with globals', function(){

  it("should require jQuery", function () {
    assert.typeOf($,"function");
  });

  it("should define sortable", function () {
    assert.typeOf(sortable,"function");
  });

  it("should define $().sortable", function () {
    assert.typeOf($().sortable,"function");
  });

});
