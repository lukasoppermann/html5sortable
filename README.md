HTML5 Sortable library
============================

[![Build Status](https://img.shields.io/travis/voidberg/html5sortable/master.svg?style=flat-square)](https://travis-ci.org/voidberg/html5sortable) [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md) [![Coverage Status](https://img.shields.io/coveralls/voidberg/html5sortable/master.svg?style=flat-square)](https://coveralls.io/github/voidberg/html5sortable) [![Git Release](https://img.shields.io/github/release/voidberg/html5sortable.svg?style=flat-square)](https://github.com/voidberg/html5sortable/releases) ![Bower](https://img.shields.io/bower/v/html.sortable.svg?style=flat-square) [![NPM](https://img.shields.io/npm/v/html5sortable.svg?style=flat-square)](https://www.npmjs.com/package/html5sortable)

> **Lightweight standalone library for creating sortable lists and grids using native HTML5 drag and drop API.**

## Features
* Less than 1KB (minified and gzipped).
* Built using native HTML5 drag and drop API.
* Supports both list and grid style layouts.
* Supported Browsers: Current versions of all major browsers (Chrome, Firefox, Safari, Opera), IE10+
* Supports exports as AMD, CommonJS or global
* Comes with an AngularJS directive [help wanted](#angularjs-usage)

**Demo:** Check out the **[examples](http://lukasoppermann.github.io/html5sortable/examples/index.html)**

# Installation

### The recommended way, using [Bower](http://bower.io):

```
bower install html.sortable --save
```
### The non-Bower way:
include `html.sortable.x.y.z.js` or the minified version, `html.sortable.min.x.y.z.js`.

### Install via [NPM](https://github.com/npm/npm#super-easy-install):

```
npm install html5sortable --save
```
# Examples
You can find the **[examples online](http://lukasoppermann.github.io/html5sortable/examples/index.html)** or test locally.
```shell
# To get the local examples to work do the following:
git clone https://github.com/voidberg/html5sortable
cd html5sortable
bower install
```

# Build it / Hack it
**1. Clone and install the project**
You will need `npm`, choose any way you like to [install npm](https://github.com/npm/npm#super-easy-install).
```
git clone https://github.com/voidberg/html5sortable
cd html5sortable
npm install && bower install
```

**2. Send a PR**
If you send a *pull request* make sure it passes the tests & linting. Please see [CONTRIBUTING](CONTRIBUTING.md) for details.
```
npm test
```


# Usage

Use `sortable` method to create a sortable list:

``` javascript
sortable('.sortable');
```

## Styling

Use `.sortable-placeholder` CSS selectors to change the styles of the placeholder. You may change the class by setting the `placeholderClass` option in the config object.

``` javascript
sortable('.sortable', {
  placeholderClass: 'my-placeholder fade'
});
```

## Events
NOTE: Events can be listened on any element from the group (when using `connectWith`), since the same event will be dispatched on all of them.

### sortstart
Use `sortstart` event if you want to do something when sorting starts:

``` javascript
sortable('.sortable')[0].addEventListener('sortstart', function(e) {
    /*

    This event is triggered when the user starts sorting and the DOM position has not yet changed.

    e.detail.item contains the current dragged element
    e.detail.placeholder contains the placeholder element
    e.detail.startparent contains the element that the dragged item comes from

    */
});
```

### sortstop
Use the `sortstop` event if you want to do something when sorting stops:

``` javascript
sortable('.sortable')[0].addEventListener('sortstop', function(e) {
    /*

    This event is triggered when the user stops sorting. The DOM position may have changed.

    e.detail.item contains the element that was dragged.
    e.detail.startparent contains the element that the dragged item came from.

    */
});
```

### sortupdate

Use `sortupdate` event if you want to do something when the order changes (e.g. storing the new order):

``` javascript
sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
    /*

    This event is triggered when the user stopped sorting and the DOM position has changed.

    e.detail.item contains the current dragged element.
    e.detail.index contains the new index of the dragged element (considering only list items)
    e.detail.oldindex contains the old index of the dragged element (considering only list items)
    e.detail.elementIndex contains the new index of the dragged element (considering all items within sortable)
    e.detail.oldElementIndex contains the old index of the dragged element (considering all items within sortable)
    e.detail.startparent contains the element that the dragged item comes from
    e.detail.endparent contains the element that the dragged item was added to (new parent)

    */
});
```

## Options

### items
Use `items` option to specify which items inside the element should be sortable:

``` javascript
sortable('.sortable', {
    items: ':not(.disabled)'
});
```
### handle
Use `handle` option to restrict drag start to the specified element:

``` javascript
sortable('.sortable', {
    handle: 'h2'
});
```
### forcePlaceholderSize
Setting `forcePlaceholderSize` option to true, forces the placeholder to have a height:

``` javascript
sortable('.sortable', {
    forcePlaceholderSize: true
});
```

### connectWith
Use `connectWith` option to create connected lists:

``` javascript
sortable('.js-sortable, .js-second-sortable', {
    connectWith: 'connected' // unique string, which is not used for other connectWith sortables
});
```

### placeholder
Use `placeholder` option to specify the markup of the placeholder:

``` javascript
sortable('.sortable', {
  items: 'tr' ,
  placeholder: '<tr><td colspan="7">&nbsp;</td></tr>'
});
```

### hoverClass
Use `hoverClass` option to specify applying a css class to the hovered element rather than relying on `:hover`. This can eliminate some potential drag and drop issues where another element thinks it is being hovered over.

``` javascript
sortable('.sortable', {
  hoverClass: 'is-hovered' // Defaults to false
});
```

## Methods

### destroy
To remove the sortable functionality completely:

``` javascript
sortable('.sortable', 'destroy');
```

### disable
To disable the sortable temporarily:

``` javascript
sortable('.sortable', 'disable');
```

### enable
To enable a disabled sortable:

``` javascript
sortable('.sortable', 'enable');
```

### reload
When you add a new item to a sortable, it will not automatically be a draggable item, so you will need to reinit the sortable. Your previously added options will be preserved.

``` javascript
sortable('.sortable');
```

## Sorting table rows

The plugin has limited support for sorting table rows. To sort table rows:

 * Initialize plugin on `tbody` element
 * Keep in mind that different browsers may display different ghost image of the row during the drag action. Webkit browsers seem to hide entire contents of `td` cell if there are any inline elements inside the `td`. This may or may not be fixed by setting the `td` to be `position: relative;`

## AngularJS usage

**HELP WANTED:** If you know angular and want to help get this package up to date and cleaned up, please contact me ([lukasoppermann](https://github.com/lukasoppermann)) or start submitting PRs.

Make your app use the `htmlSortable` module. Assign html sortable options to the `html-sortable` tag, specify an ng-model and, optionally, specify a callback using `html-sortable-callback`.
``` javascript
$scope.sortableOptions = {
  placeholder: '<div class="sortable-placeholder col-md-3"><div></div></div>',
    forcePlaceholderSize: true
};

$scope.sortableCallback = function (startModel, destModel, start, end) {
  // ...
};
```

``` html
<ul html-sortable="sortableOptions" html-sortable-callback="sortableCallback(startModel, destModel, start, end)" ng-model='data1'>
  <li ng-repeat="itm in data1">
      {{itm}}
   </li>
</ul>
```
See the [examples](#examples) for more information.

## Authors & Contributors

This version is mantained by [Alexandru Badiu](https://github.com/voidberg) & [Lukas Oppermann](https://github.com/lukasoppermann).

Thanks to [all contributors](../../contributors) who contributed fixes and improvements.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Comment your code
Your code should be as self-documenting as possible, but because this is an open source project with multiple contributors please add comments whenever possible.

### Docblocks for functions

Every function should have a docblock above stating what the function does and what parameters it is supposed to get.
```javascript
/*
* remove event handlers from sortable
* @param: {Element} sortable
*/
```

### Comment on individual lines
You do not need to comment on everything you do, but if you make a decision that could be confusion or something could be potentially seen as an error (e.g. because it is not the default way or not the most obvious way) please comment on why you did this. This prevents people from “fixing” stuff that is not broken and maybe breaking things because of this.

## Add tests
Please add tests using mocha and jsdom, to verify & test your changes. Make sure to make your test fail first, so you are sure they work.
Since tests are very important, your PR is going to be failed by coveralls, if you do not include tests.

If something is hard to test, you probably need to refactor it into multiple small functions. This is one of the good effects of testing, it improves your code quality.

Just add a new `.js` file to the `test` folder, or add a test to one of the files that already exist.

## Styleguide

> *While the code does not pass the linking yet, we are working on it. Please ensure your code does pass our linting.*

Take care to maintain the existing coding style. Lint and test your code using `npm test`.

### Keep lines as short as possible (max. 80 characters)
Keeping your lines short makes it much more easy to spot errors and for other developers to scan the code.

Keeping to an 80 character limit makes you think more about how to code something and often forces you to refactor and simplify your code.

Lastly, less character per line, mean less potential merge conflicts.

### Don’t use multiple var declaration (except for-loop)
```javascript
BAD:
var sortableElement = this, index, placeholder;

Good:
var sortableElement = this;
var index;
var placeholder;
```

While a little verbose, declaring one variable per line makes the code much more easy to scan.
Additionally this helps when merging PRs.

### Don’t use chaining
```javascript
BAD:
var foo = bar.filter(placeholders).map(baz);

Good:
var foo = bar.filter(placeholders);
foo = foo.map(baz);
```

While this can be a nice feature it makes the code less maintainable, harder to read and harder to understand. **Don’t use chaining**.

### Don’t use else if, try to avoid else
```javascript
// This:
if( a === b){
  …
} else if ( a === c){
  …
}

// Actually means this:
if( a === b){
  …
} else {
  if ( a === c){
    …
  }
}
```
**else if** does not exist in javascript, so do not use it.

If at all possible, also try to refrain from using else.

```javascript
if( a === b){
  return …
} else {
  return …
}

// Could be refactor to
if( a === b){
  return …
}
return …
```

### Reduce parameters (max. 3)
Never use more than 3 parameters, this will keep you from falling into bad habits. If you need complex configuration (which you should try to avoid), use an object.

### Reduce nesting depth (max. 3)
Do not nest too deeply. This will make the code confusing, hard to read, and again, makes merging hard.
If your code gets too complex, try to refactor parts out into individual functions.

# Roadmap
If you want to help us by working on any of the points below, please let me know and I add you and your branch to the list.

- [ ] clean up & add comments (wip)
- [ ] mocha tests (wip)
- [ ] Refactor & break code into functions (wip)
- [ ] Nesting via drag & drop
- [ ] refactor to have gulp create
  - [ ] jQuery version
  - [ ] plain js version
- [x] ~~use css framework for examples~~
- [x] ~~make this compatible with~~
  - [x] ~~plain js~~
  - [x] ~~amd~~
  - [x] ~~commonjs~~
