HTML5 Sortable jQuery Plugin
============================

> **Lightweight jQuery plugin to create sortable lists and grids using native HTML5 drag and drop API.**

## Features
* Less than 1KB (minified and gzipped).
* Built using native HTML5 drag and drop API.
* Supports both list and grid style layouts.
* Similar API and behaviour to jquery-ui sortable plugin.
* Works in IE 5.5+, Firefox 3.5+, Chrome 3+, Safari 3+ and, Opera 12+.
* Comes with an AngularJS directive.

# Installation

* The recommended way, using [Bower](http://bower.io):

```
bower install html.sortable
```
* The non-Bower way: include `html.sortable.x.y.z.js` or the minified version, `html.sortable.min.x.y.z.js`.


# Examples

* [Examples](http://htmlpreview.github.io/?https://github.com/voidberg/html5sortable/blob/master/examples/examples.html)
* [AngularJS with a single list](http://htmlpreview.github.io/?https://github.com/voidberg/html5sortable/blob/master/examples/angular-single.html)
* [AngularJS with connected lists](http://htmlpreview.github.io/?https://github.com/voidberg/html5sortable/blob/master/examples/angular-connected.html)
* [AngularJS with connected lists and ngRepeat](http://htmlpreview.github.io/?https://github.com/voidberg/html5sortable/blob/master/examples/angular-ngRepeat-connected.html)


# Build it / Hack it

**1. Node package manager (npm)**  
You will need `npm`, choose any way you like to [install npm](https://github.com/npm/npm#super-easy-install).

**2. Clone and install the project**
```
git clone https://github.com/voidberg/html5sortable
cd html5sortable
npm install
```

**3. Commit**  
If your send a *pull request* which changes `html.sortable.js` or `html.sortable.angular.js` you must run the build task before committing. This will bump the version number.
If commit a change that does not effect the plugin directly, like updating an example file or a tests, etc. you should **not** run the build task, because this has no effect on the people downloading the file via bower.
```
npm run build
```

While working you can run the liniting & validation task.
```
npm test
```


# Usage

Use `sortable` method to create a sortable list:

``` javascript
$('.sortable').sortable();
```

## Styling

Use `.sortable-placeholder` CSS selectors to change the styles of a dragging item and its placeholder respectively.

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

## jquery-ui API compatibility
The API is compatible with jquery-ui. So you can use jquery-ui as a polyfill in older browsers:

``` javascript
yepnope({
    test: Modernizr.draganddrop,
    yep: 'html.sortable.js',
    nope: 'jquery-ui.min.js',
    complete: function() {
        $('.sortable').sortable().bind('sortupdate', function(e, ui) {
            //Store the new order.
        }
    }
});
```

##AngularJS usage

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

##Authors

Original code by Ali Farhadi. This version is mantained by [Alexandru Badiu](http://ctrlz.ro).

##Contributors

See [AUTHORS file](/AUTHORS).

##Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code using [Grunt](http://gruntjs.com/).

When sending pull requests make sure to only include changes that directly relate to the fix/feature you are adding and also start a pull request from a freshly cloned copy of the repo to make it easy to merge.

If you're creating a pull request, also please add yourself to the `AUTHORS` file.

#License

Released under the MIT license.
