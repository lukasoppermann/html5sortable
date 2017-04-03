# HTML5 Sortable

[![Build Status](https://img.shields.io/travis/lukasoppermann/html5sortable/master.svg?style=flat-square)](https://travis-ci.org/lukasoppermann/html5sortable) [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md) [![Coverage Status](https://img.shields.io/coveralls/lukasoppermann/html5sortable/master.svg?style=flat-square)](https://coveralls.io/github/lukasoppermann/html5sortable) [![Known Vulnerabilities](https://snyk.io/test/github/lukasoppermann/html5sortable/badge.svg?style=flat-square)](https://snyk.io/test/github/lukasoppermann/html5sortable) [![NPM](https://img.shields.io/npm/v/html5sortable.svg?style=flat-square)](https://www.npmjs.com/package/html5sortable)
[![npm](https://img.shields.io/npm/dt/html5sortable.svg?style=flat-square)](https://www.npmjs.com/package/html5sortable)

> **Lightweight vanillajs micro-library for creating sortable lists and grids using native HTML5 drag and drop API.**

## Features
* Only 2KB (minified and gzipped).
* Built using native HTML5 drag and drop API. No dependencies.
* Supports both list and grid style layouts.
* Supported Browsers: Current versions of all major browsers (Chrome, Firefox, Safari, Opera), IE10+
* Supports exports as AMD, CommonJS or global

**Demo:** Check out the **[examples](http://lukasoppermann.github.io/html5sortable/index.html)**

# Support

| Browser | Chrome | Firefox | Safari | Opera | IE |
|---|---|---|---|---|---|
| Tested version | 39 | 34 | 7.1.2 |  26 | IE9+ |

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
You can find the **[examples online](http://lukasoppermann.github.io/html5sortable/examples/index.html)** or test locally. **Warning:** the online demo is just to show off the features and is most likely not up to date. Please study this readme file for the current way of implementing and using `html5sortable`.

# Build it / Hack it
**1. Clone and install the project**
You will need `npm`, choose any way you like to [install npm](https://github.com/npm/npm#super-easy-install).
```
git clone https://github.com/lukasoppermann/html5sortable
cd html5sortable
npm install
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

## Contributing
This version is maintained by [Lukas Oppermann](https://github.com/lukasoppermann) and [many other contributors](../../contributors). Thanks for your help! :+1:

Contributions are always welcome. Please check out the [contribution guidelines](CONTRIBUTING.md) to make it fast & easy for us to merge your PR.

### Comment your code
Your code should be as self-documenting as possible, but because this is an open source project with multiple contributors please add comments whenever possible/sensible.

### Docblocks for functions

Every function should have a docblock above stating what the function does and what parameters it is supposed to get.
```javascript
/*
* remove event handlers from sortable
* @param: {Element} sortable
*/
```

### Comment on individual lines
You do not need to comment on everything you do, but if you make a decision that could be confusion or something could be potentially seen as an error (e.g. because it is not the default way or not the most obvious way) please comment on why you did this. This prevents people from “fixing” stuff that is not broken.

## Add tests
Please add tests using mocha and jsdom, to verify & test your changes. Make sure to make your test fail first, so you are sure they work. Your PR will fail, if you do not include tests.

Just add a new `.js` file to the `test` folder, or add a test to one of the files that already exist.

# Roadmap
If you want to help us by working on any of the points below, please let me know and I add you and your branch to the list.

- [ ] clean up & add comments (wip)
- [ ] mocha tests (wip)
- [ ] Refactor & break code into functions (wip)
- [ ] Nesting via drag & drop
