require.config({
	baseUrl: "./",
	paths: {
    "jquery": "../../node_modules/jquery/dist/jquery"
  }
});
require(["../../dist/html.sortable.js"], function(sortable) {
  // test specific use cases
  describe("AMD", function () {
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

  if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
  else { mocha.run(); }
});
