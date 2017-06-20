# HTML5Sortable

[![Build Status](https://img.shields.io/travis/lukasoppermann/html5sortable/master.svg?style=flat-square)](https://travis-ci.org/lukasoppermann/html5sortable) [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md) [![Coverage Status](https://img.shields.io/coveralls/lukasoppermann/html5sortable/master.svg?style=flat-square)](https://coveralls.io/github/lukasoppermann/html5sortable) [![Known Vulnerabilities](https://snyk.io/test/github/lukasoppermann/html5sortable/badge.svg?style=flat-square)](https://snyk.io/test/github/lukasoppermann/html5sortable) [![NPM](https://img.shields.io/npm/v/html5sortable.svg?style=flat-square)](https://www.npmjs.com/package/html5sortable)
[![npm](https://img.shields.io/npm/dt/html5sortable.svg?style=flat-square)](https://www.npmjs.com/package/html5sortable)

> **Lightweight vanillajs micro-library for creating sortable lists and grids using native HTML5 drag and drop API.**

## Features
* Only 2KB (minified and gzipped).
* Built using native HTML5 drag and drop API. No dependencies.
* Supports both list and grid style layouts.
* Supported Browsers: Current versions of all major browsers (Chrome, Firefox, Safari, Opera, Edge), IE11+
* Supports exports as AMD, CommonJS or global

**Demo:** Check out the **[examples](http://lukasoppermann.github.io/html5sortable/index.html)**

## Framework adapters
If you would like to add an adapter to the list, please [create an issue](https://github.com/lukasoppermann/html5sortable/issues) with the link to your adapter.
- **Polymer:** https://github.com/trofrigo/polymer-html5sortable

# Installation

You need to install the package using `npm` or downloading it manually. Afterwards you need to load `dist/html.sortable.js` or the minified version, `dist/html.sortable.min.js`. **Make sure to grab the file from the `dist/` directory.**

```
npm install html5sortable --save
```

Still using **bower**? [Look here](https://github.com/lukasoppermann/html5sortable/wiki/Installation#bower).

# Examples
You can find the **[examples online](https://lukasoppermann.github.io/html5sortable/index.html)** or test locally. **Warning:** the online demo is just to show off the features and is most likely not up to date. Please study this readme file for the current way of implementing and using `html5sortable`.

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

## Nesting
You can nest sortables inside each other. However, take care to add a wrapper around the items, a sortable-item can **not** at the same time be a `sortable`.

```html
<div class="list"><!-- Sortable -->
  <div class="item"> Item 1
    <div class="sublist"><!-- Nested Sortable; Wrapping container needed -->
      <div class="subitem">Subitem 1</div>
      <div class="subitem">Subitem 2</div>
    </div>
  </div>
  <div class="item"> Item 2 </div>
</div>
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
    e.detail.newEndList contains all elements in the list the dragged item was dragged to
    e.detail.newStartList contains all elements in the list the dragged item was dragged from
    e.detail.oldStartList contains all elements in the list the dragged item was dragged from BEFORE it was dragged from it
    */
});
```

## Options

### items
Use the `items` option to specify which items inside the element should be sortable:

``` javascript
sortable('.sortable', {
    items: ':not(.disabled)'
});
```
### handle
Use the `handle` option to restrict drag start to the specified element:

``` javascript
sortable('.sortable', {
    handle: 'h2'
});
```
### forcePlaceholderSize
Setting the `forcePlaceholderSize` option to true, forces the placeholder to have a height:

``` javascript
sortable('.sortable', {
    forcePlaceholderSize: true
});
```

### connectWith
Use the `connectWith` option to create a connected lists:

``` javascript
sortable('.js-sortable, .js-second-sortable', {
    connectWith: 'connected' // unique string, which is not used for other connectWith sortables
});
```

### placeholder
Use the `placeholder` option to specify the markup of the placeholder:

``` javascript
sortable('.sortable', {
  items: 'tr' ,
  placeholder: '<tr><td colspan="7">&nbsp;</td></tr>'
});
```

### hoverClass
Use the `hoverClass` option to specify applying a css class to the hovered element rather than relying on `:hover`. This can eliminate some potential drag and drop issues where another element thinks it is being hovered over.

``` javascript
sortable('.sortable', {
  hoverClass: 'is-hovered' // Defaults to false
});
```

### maxItems
Use the `maxItems` option to restrict the number of items that can be added to a sortable from a [connected](#connectwith) sortable. `maxItems` should always be combined with the `items` option. Make sure `items` does not match placeholder and other options, so that they are not counted.

``` javascript
sortable('.sortable', {
  maxItems: 3 // Defaults to 0 (no limit)
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

### serialize
To serialize a sortable:

``` javascript
sortable('.sortable', 'serialize');
```

This will return an array of objects, each with a `list` key for the sortable and a `children` key for the children.

```javascript
[
  0: {
    list: ul.js-sortable // Object
    children: [
      0: li, // object
      1: li // object
    ]
  }
]
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

## Contributing
This version is maintained by [Lukas Oppermann](https://github.com/lukasoppermann) and [many other contributors](../../contributors). Thanks for your help! :+1:

Contributions are always welcome. Please check out the [contribution guidelines](CONTRIBUTING.md) to make it fast & easy for us to merge your PR.
