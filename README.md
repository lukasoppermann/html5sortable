HTML5 Sortable jQuery Plugin
============================

[![Build Status](https://travis-ci.org/voidberg/html5sortable.svg?branch=master)](https://travis-ci.org/voidberg/html5sortable) [![Coverage Status](https://coveralls.io/repos/voidberg/html5sortable/badge.svg)](https://coveralls.io/r/voidberg/html5sortable)

> **Lightweight jQuery plugin to create sortable lists and grids using native HTML5 drag and drop API.**

## Features
* Less than 1KB (minified and gzipped).
* Built using native HTML5 drag and drop API.
* Supports both list and grid style layouts.
* ~~Works in IE 5.5+, Firefox 3.5+, Chrome 3+, Safari 3+ and, Opera 12+.~~ (needs testing)
* Supports exports as AMD, CommonJS or global
* Comes with an AngularJS directive [help wanted](#angularjs-usage)

**Demo:** Check out the **[examples](http://lukasoppermann.github.io/html5sortable/examples/index.html)**

# Installation

### The recommended way, using [Bower](http://bower.io):

```
bower install html.sortable —save
```
### The non-Bower way:
include `html.sortable.x.y.z.js` or the minified version, `html.sortable.min.x.y.z.js`.

### Install via [NPM](https://github.com/npm/npm#super-easy-install):

```
npm install html.sortable —save
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

**1. Node package manager (npm)**  
You will need `npm`, choose any way you like to [install npm](https://github.com/npm/npm#super-easy-install).

**2. Clone and install the project**
```
git clone https://github.com/voidberg/html5sortable
cd html5sortable
npm install && bower install
```

**3. Commit**  
If you send a *pull request* make sure it passes the tests & linting. Please do **NOT** bump the version number.
```
npm test
```

> *Note: At the moment you will get the following warnings, if your PR does not add any other warning, it is considered to have passed:*
- 2x This function has too many statements. (for src/html.sortable.js)
- 2x Line must be at most 80 characters (for src/html.sortable.js)

> *We are going to fix those linting issues in the near future.*

**4. Merging PRs and building (only if you have commit rights)**

After merging a PR run the following command to build the minified versions and bump the version number.
```
npm run build
```


# Usage

Use `sortable` method to create a sortable list:

``` javascript
$('.sortable').sortable();
```

## Styling

Use `.sortable-placeholder` CSS selectors to change the styles of the placeholder. You may change the class by setting the `sortableClass` option in the config object.

``` javascript
$('.sortable').sortable({
  sortableClass: 'my-placeholder fade'
});
```

## Events

### sortstart
Use `sortstart` event if you want to do something when sorting starts:

``` javascript
$('.sortable').sortable().bind('sortstart', function(e, ui) {
    /*

    This event is triggered when the user starts sorting and the DOM position has not yet changed.

    ui.item contains the current dragged element.
    ui.startparent contains the element that the dragged item comes from

    */
});
```

### sortupdate

Use `sortupdate` event if you want to do something when the order changes (e.g. storing the new order):

``` javascript
$('.sortable').sortable().bind('sortupdate', function(e, ui) {
    /*

    This event is triggered when the user stopped sorting and the DOM position has changed.

    ui.item contains the current dragged element.
    ui.item.index() contains the new index of the dragged element
    ui.oldindex contains the old index of the dragged element
    ui.startparent contains the element that the dragged item comes from
    ui.endparent contains the element that the dragged item was added to

    */
});
```

## Options

### items
Use `items` option to specifiy which items inside the element should be sortable:

``` javascript
$('.sortable').sortable({
    items: ':not(.disabled)'
});
```
### handle
Use `handle` option to restrict drag start to the specified element:

``` javascript
$('.sortable').sortable({
    handle: 'h2'
});
```
### forcePlaceholderSize
Setting `forcePlaceholderSize` option to true, forces the placeholder to have a height:

``` javascript
$('.sortable').sortable({
    forcePlaceholderSize: true
});
```

### connectWith
Use `connectWith` option to create connected lists:

``` javascript
$('#sortable1, #sortable2').sortable({
    connectWith: '.connected'
});
```

### placeholder
Use `placeholder` option to specify the markup of the placeholder:

``` javascript
$('.sortable').sortable({
	items: 'tr' ,
	placeholder : '<tr><td colspan="7">&nbsp;</td></tr>'
});
```

## Methods

### destroy
To remove the sortable functionality completely:

``` javascript
$('.sortable').sortable('destroy');
```

### disable
To disable the sortable temporarily:

``` javascript
$('.sortable').sortable('disable');
```

### enable
To enable a disabled sortable:

``` javascript
$('.sortable').sortable('enable');
```

### reload
To reload a sortable:

``` javascript
$('.sortable').sortable('reload');
```

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
<ul html-sortable="sortableOptions" html-sortable-callback="sortableCallback" ng-model='data1'>
	<li ng-repeat="itm in data1">
   		{{itm}}
   </li>
</ul>
```
See the [examples](#examples) for more information.

## Authors

Original code by Ali Farhadi. This version is mantained by [Alexandru Badiu](http://ctrlz.ro) & [Lukas Oppermann](http://vea.re).

## Contributors

See [AUTHORS file](/AUTHORS).

## Contributing
When sending pull requests make sure to only include changes that directly relate to the fix/feature you are adding and also start a pull request from a freshly cloned copy of the repo to make it easy to merge.

Please always rebase to a single commit with a descriptive name and an explanation of why what was changed.

If you’re creating a pull request, fell free to add yourself to the `AUTHORS` file.

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
var $sortable = $(this), index, placeholder;

Good:
var $sortable = $(this);
var index;
var placeholder;
```

While a little verbose, declaring one variable per line makes the code much more easy to scan.
Additionally this helps when merging PRs.

### Don’t use chaining
```javascript
BAD:
var $item = $(this).attr(‘draggable’, method === ‘enable’);

Good:
var $item = $(this);
$item.attr(‘draggable’, method === ‘enable’);
```

jQuery makes it easy to chain things together, while this can be a nice feature it makes the code less maintainable, harder to read and harder to understand. **Don’t use chaining**.

### jQuery Collections should be prefix with a $

```javascript
var $sortable = $(this);
```

The prefixing of variables that store jQuery collection ensures that developers have an easy time differentiating between jQuery collections and other variables.

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
**else if** does not exists in javascript, so do not use it.

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
Do not nest to deeply. This will make the code confusing, hard to read and again, make merging hard.
If your code gets to complex, try to refactor parts out into individual functions.

# Roadmap
If you want to help us by working on any of the points below, please let me know and I add you and your branch to the list.

- [ ] clean up & add comments
- [x] use bootstrap as css for example
- [ ] Refactor & break code into functions
- [ ] Nesting via drag & drop
- [ ] mocha/chai/zombie tests
- [ ] refactor to have gulp create
  - [ ] jQuery version
  - [ ] plain js version
- [ ] make this compatible with
  - [x] plain js
  - [ ] amd
  - [x] commonjs

# License

Released under the MIT license.
